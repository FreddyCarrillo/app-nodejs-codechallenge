import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field()
  transferTypeId: number;

  @Field(() => Float)
  @IsNumber()
  value: number;
}
