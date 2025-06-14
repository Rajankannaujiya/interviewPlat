import { Job, Worker } from 'bullmq';
import redisClient from "../redis/redis-otp";
import { prisma } from '../../db/db.index';

class NotificationWorker {

    private  worker:Worker;
    constructor(){
        this.initConnection()
    }

    async initConnection(){
        this.worker = new Worker (
      "notifications",
      this.processJob.bind(this),
      {
        connection: redisClient.getRawClient(),
      }
    );

    this.worker.on("completed", (job) => {
      console.log(`Notification job ${job.id} completed`);
    });

    this.worker.on("failed", (job, err) => {
      console.error(`in Notification job ${job?.id} failed:`, err);
    });
    }


    private async processJob(job:Job):Promise<void>{

        const {notificationId } = job.data;

        const notification = await prisma.notification.findUnique({
            where:{ id: notificationId },
            include:{recipient:true}
        })
        if (!notification) {
        console.warn(`Notification with ID ${notificationId} not found`);
        return;
        }

    }
}