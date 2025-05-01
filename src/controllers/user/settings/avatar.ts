import { Context } from 'hono'
import { createError } from '@/utils/response/create-error.ts'
import { db } from '@/db'
import { table } from '@/db/schema.ts'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { internalError } from '@/utils/response/fast-responses.ts'
import { z } from '@/utils/zod.ts'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = [
	'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg', 'image/svg',
]

export const userAvatarUpdateSchema = z.object({
	file: z.custom<File>(),
})

export const userAvatarController = {
	upload: async (c: Context) => {
		const user = c.get('user')

		try {
			const body = await c.req.parseBody()
			let file = body.file as unknown as File

			if (!file || !(file instanceof File)) {
				return createError({ c, status: 400, message: 'Выберите файл' })
			}

			if (!ALLOWED_MIME_TYPES.includes(file?.type)) {
				return createError({
					c,
					status: 400,
					message: `Неверный тип файла, разрешенные форматы: ${ALLOWED_MIME_TYPES.join(', ')}`,
				})
			}

			if (file?.size > MAX_FILE_SIZE) {
				return createError({
					c,
					status: 400,
					message: `Максимальный размер файла - ${MAX_FILE_SIZE / 1024 / 1024} мб`,
				})
			}

			const extension = extname(file.name).slice(1) || 'bin'
			const randomName = `${randomUUID()}.${extension}`
			const uploadPath = `/avatars/${randomName}`
			const fullPath = `./public${uploadPath}`

			await mkdir(`./public/avatars`, { recursive: true })

			const buffer = Buffer.from(await file.arrayBuffer())
			await writeFile(fullPath, buffer)

			if (user.avatar) {
				try {
					await unlink(`.${user.avatar}`)
				} catch (error) {
					console.error('Error deleting old avatar:', error)
				}
			}

			const [updatedUser] = await db
				.update(table.user)
				.set({
					avatar: `/public${uploadPath}`,
				})
				.where(eq(table.user.id, user.id))
				.returning()

			return c.json({
				avatar: updatedUser.avatar,
			})
		} catch (error) {
			console.error('Upload error:', error)
			return internalError(c)
		}
	},

	delete: async (c: Context) => {
		const user = c.get('user')

		if (!user?.id) {
			return internalError(c)
		}

		if (user.avatar) {
			try {
				await unlink(`./public${user.avatar}`)
			} catch (error) {
				console.error('Error deleting avatar file:', error)
			}
		}

		await db
			.update(table.user)
			.set({
				avatar: null,
			})
			.where(eq(table.user.id, user.id))

		return c.json('ok')
	},
}
