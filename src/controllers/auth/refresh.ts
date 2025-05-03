import { Context } from 'hono'
import { z } from '@/utils/zod'
import { useSession } from '@/utils/session.ts'
import { db } from '@/db'
import { table } from '@/db/schema.ts'
import { eq } from 'drizzle-orm'
import { createError } from '@/utils/response/create-error.ts'

export const authRefreshSchema = z.object({
	refreshToken: z
		.string({
			invalid_type_error: 'Неверный токен',
			required_error: 'Неверный токен',
		}),
})

export const refreshController = {
	handle: async (c: Context, validated: z.infer<typeof authRefreshSchema>) => {
		const [session] = await db
			.select()
			.from(table.session)
			.where(eq(table.session.refreshToken, validated.refreshToken))
			.innerJoin(
				table.user,
				eq(table.session.userId, table.session.userId),
			)
			.limit(1)

		if (!session?.session || !session?.user) {
			return createError({ c, status: 401, message: 'Войдите в аккаунт' })
		}

		await useSession.revoke(validated.refreshToken)

		const { accessToken, refreshToken } = await useSession.create(c, session.user.id)

		return c.json({
			accessToken,
			refreshToken,
		})
	},
}
