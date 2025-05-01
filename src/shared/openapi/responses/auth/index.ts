import { z } from '@/utils/zod.ts'
import { resolver } from 'hono-openapi/zod'
import { OpenapiResponse } from '@/shared/openapi/types'

export const authSuccessResponseSchema: OpenapiResponse = {
	description: 'Успешно',
	content: {
		'application/json': {
			schema: resolver(
				z.object({
					accessToken: z.string(),
					refreshToken: z.string(),
				}),
			),
		},
	},
}
