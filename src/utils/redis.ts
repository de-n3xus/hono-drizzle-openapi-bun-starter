import Redis from 'ioredis'
import config from '@/config'

export const useRedis = new Redis({
	port: config.redis.port,
	host: config.redis.host,
	username: config.redis.username,
	password: config.redis.password,
	db: config.redis.db,
})
