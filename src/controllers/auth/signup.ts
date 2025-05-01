import { createError } from '@/utils/response/create-error.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'
import { Context } from 'hono'
import { z } from '@/utils/zod'
import { db } from '@/db'
import { table } from '@/db/schema.ts'
import { eq } from 'drizzle-orm'
import { useString } from '@/utils/string.ts'
import { useSession } from '@/utils/session.ts'
import consola from 'consola'

export const authSignupSchema = z.object({
	name: z
		.string({
			invalid_type_error: 'Неверное имя',
			required_error: 'Введите имя',
		})
		.min(2, 'Минимальная длина имени - 2 символа')
		.max(50, 'Максимальная длина имени - 50 символов'),
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
		.max(52, 'Максимальная длина пароля - 8 символов'),
})

export const signUpController = {
	handle: async (c: Context, validated: z.infer<typeof authSignupSchema>) => {
		try {
			const [existingUser] = await db
				.select()
				.from(table.user)
				.where(eq(table.user.email, validated.email))
				.limit(1)

			if (existingUser) {
				return createError({ c, message: `Пользователь с почтой ${validated.email} уже существует` })
			}

			const [user] = await db
				.insert(table.user)
				.values({
					login: useString.randomString(),
					name: validated.name,
					email: validated.email,
					password: await Bun.password.hash(validated.password, {
						algorithm: 'bcrypt',
					}),
				})
				.returning()

			const { accessToken, refreshToken } = await useSession.create(c, user.id)

			return c.json({
				accessToken,
				refreshToken,
			})
		} catch (err) {
			consola.error(err)
			return createError({ c, status: 500, code: ErrorCodes.internalError })
		}
	},
}
