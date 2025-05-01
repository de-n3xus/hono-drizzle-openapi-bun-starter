import process from 'node:process'

export default {
	redis: {
		port: !isNaN(+process.env.REDIS_PORT!) ? +process.env.REDIS_PORT! : +process.env.REDIS_PORT!,
		host: process.env.REDIS_HOST,
		username: process.env.REDIS_USERNAME,
		password: process.env.REDIS_PASSWORD || undefined,
		db: !isNaN(+process.env.REDIS_DB!) ? +process.env.REDIS_DB! : 0,
	},
}
