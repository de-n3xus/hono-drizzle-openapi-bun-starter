import { Hono } from 'hono'
import consola from 'consola'
import * as process from 'node:process'
import { authRoutes } from '@/routes/auth.ts'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { authMiddleware } from '@/middleware/auth.ts'
import { serveStatic } from 'hono/bun'
import { rateLimiter } from 'hono-rate-limiter'
import { getIp } from '@/middleware/ip.ts'
import { userRoutes } from '@/routes/user.ts'
import { openAPISpecs } from 'hono-openapi'
import { Scalar } from '@scalar/hono-api-reference'

const app = new Hono()

app.use('*', prettyJSON())
app.use('*', requestId())
app.use('*', getIp)
app.use('*', cors())
app.use('*', logger())
app.use(
	rateLimiter({
		windowMs: 60 * 1000, // 1 min
		limit: 100,
		standardHeaders: 'draft-7',
		keyGenerator: async (c): Promise<string> => {
			return c.get('ip')
		},
	}),
)
app.use(
	'/public/*',
	serveStatic({
		root: './',
	}),
)

app.use('*', authMiddleware)

app.get('/ui', Scalar({ url: '/openapi' }))

app.route('/auth', authRoutes)
app.route('/user', userRoutes)

app.get(
	'/openapi',
	openAPISpecs(app, {
		documentation: {
			info: {
				title: 'Shieldy API',
				version: '1.0.0',
				description: 'API Specification for Shieldy API',
			},
			servers: [
				{
					url: 'http://localhost:3000',
					description: 'Local Server',
				},
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
						description: 'Enter your JWT token in the format: Bearer {token}',
					},
				},
			},
			tags: [
				{
					name: 'Авторизация',
					description: 'Авторизация, регистрация, обновление токена и выход',
				},
				{
					name: 'Пользователь',
					description: 'Управление пользователями',
				},
			],
		},
	}),
)

Bun.serve({
	fetch: app.fetch,
	port: process.env.PORT || 3000,
	idleTimeout: 255,
})

consola.start(`Сервер запущен на порту ${process.env.PORT || 3000}`)
