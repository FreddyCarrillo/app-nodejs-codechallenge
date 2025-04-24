import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field()
  transactionExternalId: string;

  @Field()
  transactionStatus: string;

  @Field()
  transactionType: string;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}
