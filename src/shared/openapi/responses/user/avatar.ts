import { z } from '@/utils/zod.ts'
import { resolver } from 'hono-openapi/zod'
import { OpenapiResponse } from '@/shared/openapi/types'

export const userAvatarUpdatedResponseSchema: OpenapiResponse = {
	description: 'Успешно',
	content: {
		'application/json': {
			schema: resolver(
				z.object({
					avatar: z.string(),
				}),
			),
		},
	},
}
