import { Context } from 'hono'
import { createError } from '@/utils/response/create-error.ts'
import { z } from '@/utils/zod.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'
import { db } from '@/db'
import { table } from '@/db/schema.ts'
import { eq } from 'drizzle-orm'
import { useSession } from '@/utils/session.ts'

export const authSigninSchema = z.object({
	email: z
		.string({
			invalid_type_error: 'Неверная почта',
			required_error: 'Введите почту',
		})
		.email('Неверная почта'),
	password: z
		.string({
			invalid_type_error: 'Неверный тип пароля',
			required_error: 'Введите пароль',
		})
		.min(8, 'Минимальная длина пароля - 8 символов')
		.max(52, 'Максимальная длина пароля - 52 символа'),
})

export const signInController = {
	handle: async (c: Context, validated: z.infer<typeof authSigninSchema>) => {
		try {
			const [user] = await db
				.select()
				.from(table.user)
				.where(eq(table.user.email, validated.email))
				.limit(1)

			if (!user) {
				return createError({ c, status: 400, code: ErrorCodes.auth.invalidEmailOrPassword })
			}

			const isValidPassword = await Bun.password.verify(validated.password, user.password, 'bcrypt')

			if (!isValidPassword) {
				return createError({ c, status: 400, code: ErrorCodes.auth.invalidEmailOrPassword })
			}

			const { accessToken, refreshToken } = await useSession.create(c, user.id)

			return c.json({
				accessToken,
				refreshToken,
			})
		} catch (err) {
			console.log('ERROR', err)
			return createError({ c, status: 500, code: ErrorCodes.internalError })
		}
	},
}
