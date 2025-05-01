import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { useEnv } from '@/utils/env'
import { createError } from '@/utils/response/create-error.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'
import { db } from '@/db'
import { table } from '@/db/schema.ts'
import { and, eq, gt } from 'drizzle-orm'
import { JWTPayload } from 'hono/utils/jwt/types'
import { useSession } from '@/utils/session.ts'

export async function authMiddleware (c: Context, next: Next) {
	const path = c.req.path

	if (
		(
			path.startsWith('/auth')
			&&
			!path.startsWith('/auth/refresh')
			&&
			!path.startsWith('/auth/logout')
		)
		||
		path.startsWith('/public')
	) {
		return next()
	}

	const token = useSession.getTokenFromRequest(c)

	if (!token) {
		return createError({ c, status: 401, code: ErrorCodes.unauthorized })
	}

	try {
		const payload = await verify(token, useEnv(c).JWT_ACCESS_SECRET) as unknown as JWTPayload & { userId: number }

		const [session] = await db
			.select()
			.from(table.session)
			.where(
				and(
					eq(table.session.userId, payload?.userId),
					eq(table.session.accessToken, token),
					eq(table.session.revoked, false),
					gt(table.session.expiresAt, new Date()),
				),
			)
			.limit(1)


		if (!session) {
			return createError({ c, status: 401, code: ErrorCodes.unauthorized })
		}

		let [user] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.id, session.userId))
			.limit(1)

		if (!user) {
			return createError({ c, status: 401, code: ErrorCodes.unauthorized })
		}

		c.set('fullUser', user)

		const { password, ...extractedUser } = user
		c.set('user', extractedUser)

		await next()
	} catch (err) {
		return createError({ c, status: 401, code: ErrorCodes.unauthorized })
	}
}
