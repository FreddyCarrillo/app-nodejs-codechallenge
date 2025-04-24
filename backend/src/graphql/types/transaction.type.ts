import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionType {
  @Field()
  name: string;
}

@ObjectType()
export class Transaction {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}
