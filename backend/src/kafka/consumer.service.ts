import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['localhost:9092'],
    });

    const consumer = kafka.consumer({ groupId: 'transaction-consumer' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'transactions', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        const data = JSON.parse(message.value.toString());

        const newStatus = data.value > 1000 ? 'rejected' : 'approved';

        const status = await this.prisma.transactionStatus.findFirst({
          where: { name: newStatus },
        });

        if (!status) return;

        await this.prisma.transaction.updateMany({
          where: { transactionExternalId: data.transactionExternalId },
          data: { transactionStatusId: status.id },
        });

        console.log(`Transaction: ${data.transactionExternalId} → ${newStatus}`);
      },
    });
  }
}
