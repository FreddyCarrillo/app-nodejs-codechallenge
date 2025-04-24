import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from './types/transaction.type';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionService: TransactionsService) {}

  @Query(() => Transaction, { nullable: true })
  async transaction(
    @Args('transactionExternalId') transactionExternalId: string,
  ) {
    return this.transactionService.getTransactionById(transactionExternalId);
  }

  @Query(() => [Transaction])
  async transactions() {
    const transactions = await this.transactionService.getAllTransactions();

    return transactions.map(tx => ({
      transactionExternalId: tx.transactionExternalId,
      transactionStatus: { name: tx.transactionStatus.name },
      transactionType: { name: tx.transactionType.name },
      value: tx.value,
      createdAt: tx.createdAt,
    }));
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('data') data: CreateTransactionInput,
  ) {
    const dto = {
      ...data,
      tranferTypeId: data.transferTypeId,
    };

    const tx = await this.transactionService.createTransaction(dto);

    return {
      transactionExternalId: tx.transactionExternalId,
      transactionStatus: { name: tx.transactionStatus.name },
      transactionType: { name: tx.transactionType.name },
      value: tx.value,
      createdAt: tx.createdAt,
    };
  }
}
