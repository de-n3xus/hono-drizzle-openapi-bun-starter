import { Context } from 'hono'
import { createError } from '@/utils/response/create-error.ts'
import { ErrorCodes } from '@/shared/error-codes.ts'

export const internalError = (c: Context) => {
	return createError({ c, status: 500, message: ErrorCodes.internalError })
}

export const notFound = (c: Context) => {
	return createError({ c, status: 404, message: 'Не найдено' })
}
