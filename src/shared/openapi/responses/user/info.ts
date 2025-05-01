import { OpenapiResponse } from '@/shared/openapi/types'
import { resolver } from 'hono-openapi/zod'
import { createSelectSchema } from 'drizzle-zod'
import { table } from '@/db/schema.ts'

export const userInfoResponseScheme: OpenapiResponse = {
	description: 'Успешный ответ',
	content: {
		'application/json': {
			schema: resolver(
				createSelectSchema(
					table.user,
				).omit({
					password: true,
				}),
			),
		},
	},
}
