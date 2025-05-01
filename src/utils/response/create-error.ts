import { Context } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'

export const createError = (
	{
		c,
		status = 404,
		code,
		message,
	}: {
		c: Context,
		status?: ContentfulStatusCode,
		code?: string,
		message?: string,
	},
) => {
	return c.json({
		code,
		message,
	}, status)
}
