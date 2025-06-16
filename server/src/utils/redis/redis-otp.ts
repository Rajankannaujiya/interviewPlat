import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();

class RedisClient {
  private static instance: RedisClient;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      maxRetriesPerRequest:null
    }
  );

    this.client.on("error", (error: any) => {
      console.error("Error while connecting to Redis:", error.message);
    });

    this.client.on("connect", () => {
      console.log("Redis client connected.");
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async setEx(key: string, ttlSeconds: number, value: string): Promise<void> {
    await this.client.set(key, value, "EX", ttlSeconds);
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
  }

  public getRawClient(): Redis {
    return this.client;
  }
}

const redisClient = RedisClient.getInstance();

export default redisClient;
export type { Redis };
