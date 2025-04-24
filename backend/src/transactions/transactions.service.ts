import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { v4 as uuidv4 } from 'uuid';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private kafkaService: KafkaService,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const statusName = dto.value > 1000 ? 'rejected' : 'pending';

    const status = await this.prisma.transactionStatus.findFirst({
      where: { name: statusName },
    });

    if (!status) throw new NotFoundException('Transaction status not found');

    const transaction = await this.prisma.transaction.create({
      data: {
        transactionExternalId: uuidv4(),
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        transferTypeId: dto.tranferTypeId,
        value: dto.value,
        transactionStatusId: status.id,
      },
      include: {
        transactionStatus: true,
        transactionType: true,
      },
    });

    await this.kafkaService.send('transactions', {
      transactionExternalId: transaction.transactionExternalId,
      value: transaction.value,
    });
    
    return transaction;
  }

  async getTransactionById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionExternalId: id },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        transactionStatus: true,
        transactionType: true,
      },
    });
  }
  
}