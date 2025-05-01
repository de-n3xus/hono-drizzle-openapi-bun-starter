import { Context } from 'hono'
import { z } from '@/utils/zod.ts'
import { createError } from '@/utils/response/create-error.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'
import { useSession } from '@/utils/session.ts'

export const authLogoutSchema = z.object({
	refreshToken: z
		.string({
			invalid_type_error: 'Неверный токен',
			required_error: 'Неверный токен',
		}),
})

export const logoutController = {
	handle: async (c: Context, validated: z.infer<typeof authLogoutSchema>) => {
		const user = c.get('user')

		if (!user) {
			return createError({ c, status: 401, code: ErrorCodes.unauthorized })
		}

		await useSession.revoke(validated.refreshToken)

		return c.json('ok')
	},
}
