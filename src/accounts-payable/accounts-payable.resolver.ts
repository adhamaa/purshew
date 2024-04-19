import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetAccount } from 'src/account/decorator/get-account.decorator';
import { Account } from 'src/account/models/account.model';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AccountTypeEnum } from 'src/drizzle/schemas/accounts/account-type.enum';
import { User } from 'src/user/models/user.model';
import { AccountsPayableService } from './accounts-payable.service';
import { CreateAccountsPayableInput } from './dto/create-accounts-payable.input';
import { UpdateAccountsPayableInput } from './dto/update-accounts-payable.input';
import { AccountsPayable } from './models/accounts-payable.model';

@UseGuards(JwtGuard)
@Resolver(() => AccountsPayable)
export class AccountsPayableResolver {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @Mutation(() => AccountsPayable)
  createAccountsPayable(
    @Args('createAccountsPayableInput')
    createAccountsPayableInput: CreateAccountsPayableInput,
    @GetUser() user: User,
  ) {
    return this.accountsPayableService.create(
      createAccountsPayableInput,
      user.id,
    );
  }

  @Query(() => [AccountsPayable], { name: 'accountsPayableAll' })
  findAll(@GetUser() user: User) {
    return this.accountsPayableService.findAll(user.id);
  }

  @Query(() => AccountsPayable, { name: 'accountsPayable' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @GetUser() user: User,
    @GetAccount(AccountTypeEnum.asset) account: Account,
  ) {
    console.log({ account });
    return this.accountsPayableService.findOne(user.id, id);
  }

  @Mutation(() => AccountsPayable)
  updateAccountsPayable(
    @Args('updateAccountsPayableInput')
    updateAccountsPayableInput: UpdateAccountsPayableInput,
    @GetUser() user: User,
  ) {
    return this.accountsPayableService.update(
      user.id,
      updateAccountsPayableInput,
    );
  }

  @Mutation(() => AccountsPayable)
  removeAccountsPayable(
    @Args('id', { type: () => String }) id: string,
    @GetUser() user: User,
  ) {
    return this.accountsPayableService.remove(user.id, id);
  }
}
