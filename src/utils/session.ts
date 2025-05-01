import { db } from '@/db'
import { table } from '@/db/schema.ts'
import { and, eq, gt, or } from 'drizzle-orm'
import { sign } from 'hono/jwt'
import dayjs from 'dayjs'
import { useEnv } from '@/utils/env.ts'
import { Context } from 'hono'

export const useSession = {
	getTokenFromRequest: (c: Context) => {
		const query = c.req.query()

		const authHeader = c.req.header('Authorization')
		const authQuery = query.accessToken

		let isHeader = false
		let isQuery = false

		if (authQuery?.trim?.() !== '' && authQuery?.trim?.()) {
			isQuery = true
		}

		if (authHeader?.startsWith?.('Bearer ')) {
			isHeader = true
		}

		if (!isQuery && !isHeader) {
			return null
		}

		if (isQuery) {
			return authQuery
		}

		return authHeader?.split?.(' ')?.[1]
	},

	revoke: async (token: string) => {
		await db
			.update(table.session)
			.set({ revoked: true })
			.where(or(
				eq(table.session.accessToken, token),
				eq(table.session.refreshToken, token),
			))
	},

	validate: async (token: string) => {
		const [session] = await db
			.select()
			.from(table.session)
			.where(
				and(
					eq(table.session.accessToken, token),
					eq(table.session.revoked, false),
					gt(table.session.expiresAt, new Date()),
				),
			)
			.limit(1)

		return session
	},

	createAccessToken: async (c: Context, userId: number, minutes: number = 15) => {
		return await sign(
			{
				userId: userId,
				exp: dayjs().add(minutes, 'minutes').unix(),
			},
			useEnv(c).JWT_ACCESS_SECRET,
		)
	},

	createRefreshToken: async (c: Context, userId: number, days: number = 30) => {
		return await sign(
			{
				userId: userId,
				exp: dayjs().add(days, 'days').unix(),
			},
			useEnv(c).JWT_REFRESH_SECRET,
		)
	},

	create: async (c: Context, userId: number) => {
		const accessToken = await useSession.createAccessToken(c, userId)
		const refreshToken = await useSession.createRefreshToken(c, userId)

		await db.insert(table.session).values({
			userId: userId,
			accessToken,
			refreshToken,
			expiresAt: dayjs().add(14, 'days').toDate(),
			revoked: false,
		})

		return { accessToken, refreshToken }
	},
}
