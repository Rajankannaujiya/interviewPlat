import { Job, Queue, Worker } from 'bullmq';
import redisClient from "../redis/redis-otp";
import { prisma } from '../../db/db.index';
import { sendInteviewScheduleMail, sendSms } from '../smsAndMails/config';

class NotificationWorker {

  private worker: Worker;
  constructor() {
    this.worker = new Worker(
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

  private async processJob(job: Job): Promise<void> {

    const { notificationId } = job.data;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: { recipient: true }
    })
    if (!notification) {
      console.warn(`Notification with ID ${notificationId} not found`);
      return;
    }

    let success;

    try {
      const recipient = notification.recipient;

      if (notification.channel === "EMAIL" && recipient.email && recipient.isEmailVerified) {
        console.log(recipient)
        await sendInteviewScheduleMail(notification.type, notification.message,  recipient.email,);
        success = true;
      } else if (notification.channel === "SMS" && recipient.mobileNumber && recipient.isMobileVerified) {
        await sendSms(recipient.mobileNumber, notification.message);
        success = true;
      }
    } catch (error:any) {
      console.error("Error sending notification:", error?.message);
    }

    await prisma.notification.update({
      where: {
        id: notification.id
      },
      data: {
        status: success ? "SENT" : "FAILED",
        sentAt: new Date()
      }
    });

    console.log("notification processed from processJob")
  }

async addNotificationToQueue(notificationId: string){

  const notificationQueue = new Queue("notifications", {
    connection: redisClient.getRawClient()
  });

  await notificationQueue.add("send", {notificationId})

}

  public get workerInstance(): Worker {
    return this.worker;
  }
}


const bullMqWorker = new NotificationWorker();

export default bullMqWorker;

export type {Worker};