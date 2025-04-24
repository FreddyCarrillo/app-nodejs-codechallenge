import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
  });

  private producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async send(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
