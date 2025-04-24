import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TransactionsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
    }),
  ],
  providers: [TransactionsResolver],
})
export class TransactionGraphQLModule {}
