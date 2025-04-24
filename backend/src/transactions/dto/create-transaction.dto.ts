import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsInt()
  tranferTypeId: number;

  @IsPositive()
  value: number;
}
