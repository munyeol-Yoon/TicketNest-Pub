import { Redis } from 'ioredis';
import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { BookingService } from './bull.service';
import { OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

// @Controller('booking')
// export class BookingController implements OnModuleInit {
//   constructor(
//     @Inject('REDIS_CLIENT') private readonly redis: Redis,
//     private readonly bookingService: BookingService,
//   ) {}

//   onModuleInit() {
//     this.redis.subscribe('Ticket');
//     this.redis.on('message', async (channel, message) => {
//       const booking = JSON.parse(message);
//       const createBooking = await this.bookingService.createBooking(booking);
//     });
//   }
// }

@Processor('Ticket')
export class BookingProcessor {
  constructor(private readonly bookingService: BookingService) {}

  @Process('createBooking')
  async createBooking(job: Job<unknown>) {
    const bookingData = job.data;
    const createBooking = await this.bookingService.createBooking(bookingData);
    // if (createBooking === true) job.finished();
  }

  // @OnQueueEvent('completed')
  // onJobCompleted(job: Job, result: any) {
  //   console.log(`Job ${job.id} has completed with result: ${result}`);
  // }
}
