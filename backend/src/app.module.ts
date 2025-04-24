import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { TransactionGraphQLModule } from './graphql/graphql.module';

@Module({
  imports: [
    TransactionsModule, 
    PrismaModule, 
    KafkaModule,
    TransactionGraphQLModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
