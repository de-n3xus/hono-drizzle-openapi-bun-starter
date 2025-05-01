import { Hono } from 'hono'
import { authSigninSchema, signInController } from '@/controllers/auth/signin.ts'
import { authSignupSchema, signUpController } from '@/controllers/auth/signup.ts'
import { authRefreshSchema, refreshController } from '@/controllers/auth/refresh.ts'
import { authLogoutSchema, logoutController } from '@/controllers/auth/logout.ts'
import { validate } from '@/utils/request/validate.ts'
import { describeRoute } from 'hono-openapi'
import { authSuccessResponseSchema } from '@/shared/openapi/responses/auth'
import { defaultErrorResponse, defaultOkResponse } from '@/shared/openapi/responses'

const router = new Hono()

router.post(
	'/signin',
	describeRoute({
		tags: ['Авторизация'],
		responses: {
			200: authSuccessResponseSchema,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	validate('json', authSigninSchema),
	(c) => {
		return signInController.handle(c, c.req.valid('json'))
	},
)

router.post(
	'/signup',
	describeRoute({
		tags: ['Авторизация'],
		responses: {
			200: authSuccessResponseSchema,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	validate('json', authSignupSchema),
	(c) => {
		return signUpController.handle(c, c.req.valid('json'))
	},
)

router.post(
	'/refresh',
	describeRoute({
		tags: ['Авторизация'],
		responses: {
			200: authSuccessResponseSchema,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	validate('json', authRefreshSchema),
	(c) => {
		return refreshController.handle(c, c.req.valid('json'))
	},
)

router.post(
	'/logout',
	describeRoute({
		tags: ['Авторизация'],
		responses: {
			200: defaultOkResponse,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	validate('json', authLogoutSchema), (c) => {
		return logoutController.handle(c, c.req.valid('json'))
	},
)

export const authRoutes = router
