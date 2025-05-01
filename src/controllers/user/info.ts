import { Context } from 'hono'

export const userInfoController = {
	handle: async (c: Context) => {
		return c.json(c.get('user'))
	},
}
