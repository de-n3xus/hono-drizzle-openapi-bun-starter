import { Context } from 'hono'
import { env } from 'hono/adapter'
import { Env } from '@/types/env'

export const useEnv = (c: Context) => {
	return env<Env>(c)
}
