import { Context } from 'hono'
import { z } from '@/utils/zod'
import { createError } from '@/utils/response/create-error.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'
import { useSession } from '@/utils/session.ts'

export const authRefreshSchema = z.object({
	refreshToken: z
		.string({
			invalid_type_error: 'Неверный токен',
			required_error: 'Неверный токен',
		}),
})

export const refreshController = {
	handle: async (c: Context, validated: z.infer<typeof authRefreshSchema>) => {
		const user = c.get('user')

		if (!user) {
			return createError({ c, status: 401, code: ErrorCodes.unauthorized })
		}

		await useSession.revoke(validated.refreshToken)

		const { accessToken, refreshToken } = await useSession.create(c, user.id)

		return c.json({
			accessToken,
			refreshToken,
		})
	},
}
