import { ZodSchema } from 'zod'
import type { ValidationTargets } from 'hono'
import { createError } from '@/utils/response/create-error.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'
import {
	validator as zodValidator,
} from 'hono-openapi/zod'

export const validate = <T extends ZodSchema, Target extends keyof ValidationTargets> (
	target: Target,
	schema: T,
) => {
	return zodValidator(
		target,
		schema,
		(result, c) => {
			if (!result.success) {
				console.log(result)

				return createError({
					c,
					status: 400,
					code: ErrorCodes.validationError,
					message: result.error?.issues?.[0]?.message,
				})
			}
		},
	)
}
