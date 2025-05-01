import { OpenapiResponse } from '@/shared/openapi/types'
import { resolver } from 'hono-openapi/zod'
import { z } from '@/utils/zod.ts'

export const defaultErrorResponse: OpenapiResponse = {
	description: 'Ошибка',
	content: {
		'application/json': {
			schema: resolver(
				z.object({
					code: z.string().optional(),
					message: z.string().optional(),
				}),
			),
		},
	},
}

export const defaultOkResponse: OpenapiResponse = {
	description: 'Успешный ответ',
	content: {
		'application/json': {
			schema: resolver(
				z.string().default('ok'),
			),
		},
	},
}
