import { Context } from 'hono'
import { z } from '@/utils/zod.ts'
import { db } from '@/db'
import { Table, table } from '@/db/schema.ts'
import { eq } from 'drizzle-orm'

export const userSettingsSchema = z.object({
	name: z
		.string({
			invalid_type_error: 'Неверное имя',
			required_error: 'Введите имя',
		})
		.min(2, 'Минимальная длина имени - 2 символа')
		.max(50, 'Максимальная длина имени - 50 символов')
		.optional(),
	password: z
		.string({
			invalid_type_error: 'Неверный тип пароля',
			required_error: 'Введите пароль',
		})
		.min(8, 'Минимальная длина пароля - 8 символов')
		.max(52, 'Максимальная длина пароля - 52 символа')
		.optional(),
})

export const userSettingsController = {
	handle: async (c: Context, validated: z.infer<typeof userSettingsSchema>) => {
		const user = c.get('user')

		const updateData: Partial<Table['user']['$inferSelect']> = {
			name: validated?.name || user?.name,
		}

		if (validated?.password) {
			updateData.password = await Bun.password.hash(validated.password, {
				algorithm: 'bcrypt',
			})
		}

		await db
			.update(table.user)
			.set(updateData)
			.where(eq(table.user.id, user.id))

		return c.json('ok')
	},
}
