import { createClient, RedisClientType } from 'redis'

export class RedisService {
  private static instance: RedisService
  private client: RedisClientType

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    })

    this.client.on('error', (err) => {
      console.error('Redis error:', err)
    })

    this.client.on('connect', () => {
      console.log('Redis connected')
    })

    this.client.on('disconnect', () => {
      console.log('Redis disconnected')
    })
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect()
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  public async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value)
  }

  public async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.client.setEx(key, seconds, value)
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key)
  }

  public async exists(key: string): Promise<number> {
    return this.client.exists(key)
  }

  public async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message)
  }

  public async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const subscriber = this.client.duplicate()
    await subscriber.connect()
    await subscriber.subscribe(channel, callback)
  }

  public getClient(): RedisClientType {
    return this.client
  }
}