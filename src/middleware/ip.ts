import { getConnInfo } from 'hono/bun'
import { createMiddleware } from 'hono/factory'

export const getIp = createMiddleware(async (c, next) => {
	let ip = (
		c.req.header('cf-connecting-ip')
		??
		c.req.header('x-forwarded-for')
		??
		c.req.header('x-real-ip')
		??
		c.req.header('x-client-ip')
		??
		c.req.header('x-forwarded')
		??
		c.req.header('forwarded')
		??
		c.req.header('forwarded-for')
	)

	if (!ip) {
		ip = getConnInfo(c).remote.address
		ip?.startsWith?.('::ffff:') && (ip = ip.slice(7))
	}

	c.set('ip', ip || '')

	await next()
})
