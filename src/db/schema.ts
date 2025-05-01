import { boolean, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	login: varchar('login').notNull().unique(),
	email: varchar('email').notNull().unique(),
	password: varchar('password').notNull(),
	name: varchar('name').notNull(),
	avatar: varchar('avatar').default(sql`NULL`),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
})

export const session = pgTable('session', {
	id: serial('id').primaryKey(),
	userId: integer('userId')
		.references(() => user.id)
		.notNull(),
	accessToken: varchar('accessToken').notNull().unique(),
	refreshToken: varchar('refreshToken').notNull().unique(),
	revoked: boolean('revoked').default(false).notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	expiresAt: timestamp('expiresAt').notNull(),
})

export const table = {
	user,
	session,
}

export type Table = typeof table
