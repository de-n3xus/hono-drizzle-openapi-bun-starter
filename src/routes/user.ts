import { Hono } from 'hono'
import { userInfoController } from '@/controllers/user/info.ts'
import { validate } from '@/utils/request/validate.ts'
import { userSettingsController, userSettingsSchema } from '@/controllers/user/settings'
import { userAvatarController, userAvatarUpdateSchema } from '@/controllers/user/settings/avatar.ts'
import { describeRoute } from 'hono-openapi'
import { defaultErrorResponse, defaultOkResponse } from '@/shared/openapi/responses'
import { userInfoResponseScheme } from '@/shared/openapi/responses/user/info.ts'
import { userAvatarUpdatedResponseSchema } from '@/shared/openapi/responses/user/avatar.ts'

const router = new Hono()

router.get(
	'/',
	describeRoute({
		tags: ['Пользователь'],
		security: [
			{
				bearerAuth: [],
			},
		],
		responses: {
			200: userInfoResponseScheme,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	userInfoController.handle,
)

router.patch(
	'/settings',
	describeRoute({
		tags: ['Пользователь'],
		security: [
			{
				bearerAuth: [],
			},
		],
		responses: {
			200: defaultOkResponse,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	validate('json', userSettingsSchema),
	(c) => {
		return userSettingsController.handle(c, c.req.valid('json'))
	},
)

router.patch(
	'/settings/avatar',
	describeRoute({
		tags: ['Пользователь'],
		security: [
			{
				bearerAuth: [],
			},
		],
		responses: {
			200: userAvatarUpdatedResponseSchema,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	validate('form', userAvatarUpdateSchema),
	userAvatarController.upload,
)
router.delete(
	'/settings/avatar',
	describeRoute({
		tags: ['Пользователь'],
		security: [
			{
				bearerAuth: [],
			},
		],
		responses: {
			200: defaultOkResponse,
			'4xx, 5xx': defaultErrorResponse,
		},
	}),
	userAvatarController.delete,
)

export const userRoutes = router
