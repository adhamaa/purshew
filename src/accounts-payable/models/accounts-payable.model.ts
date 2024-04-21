import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { InferSelectModel } from 'drizzle-orm'
import { AccountTypeEnum } from 'src/common'
import { TransactionTypeEnum } from 'src/common/enum/transaction-type.enum'
import { accountsPayable } from 'src/drizzle/schemas'

@ObjectType()
export class AccountsPayable
  implements InferSelectModel<typeof accountsPayable>
{
  @Field(() => TransactionTypeEnum)
  transactionType: TransactionTypeEnum

  @Field()
  amount: string

  @Field(() => ID)
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  itemName: string

  @Field()
  itemDescription: string

  @Field(() => Int)
  quantity: number

  @Field()
  purchasePrice: string

  @Field()
  salePrice: string

  @Field(() => AccountTypeEnum)
  accountType: AccountTypeEnum

  @Field(() => ID)
  ownerId: string

  @Field(() => ID)
  accountId: string
}
