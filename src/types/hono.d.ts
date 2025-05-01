import type { Context as HonoContext } from 'hono'
import { Table } from '@/db/schema.ts'

declare module 'hono' {
	interface ContextVariableMap {
		user: Omit<Table['user']['$inferSelect'], 'password'>,
		fullUser: Table['user']['$inferSelect'],
		ip: string,
	}
}

// required for disable IDE remove importing context
type __keepImport = HonoContext
