import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
dotenv.config();

class RedisClient{
    private client:RedisClientType;
   
    constructor(){
        this.client = createClient({
           url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        });
        
        this.client.on('orror', (error:any)=>{
            console.log("error while connecting to the redis client", error.message)
        });
    }

    async connect():Promise<void>{
     try {
           if(!this.client.isOpen){
             await  this.client.connect();
             console.log("client is connected");
           }
     } catch (error:any) {
        console.log("error connecting to client", error?.message)
     }
    }

    async setEx(key: string, ttlSeconds: number, value: string):Promise<void>{
        await this.client.setEx(key, ttlSeconds, value);
    }

    async get(key:string):Promise<string | null>{
        return await this.client.get(key);
    }


    async ttl(key:string):Promise<number | null>{
        return await this.client.ttl(key);
    }


    async del(key:string):Promise<void>{
        await this.client.del(key);
    }

    async disconnect():Promise<void>{
        this.client.destroy();
    }
}


const redisClient = new RedisClient();

export type RedisClientTypeInstance = RedisClient;

export default redisClient;