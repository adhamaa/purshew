import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { join } from 'path'
import { AccountModule } from './account/account.module'
import { AccountsPayableModule } from './accounts-payable/accounts-payable.module'
import { AccountsReceivableModule } from './accounts-receivable/accounts-receivable.module'
import { AuthModule } from './auth/auth.module'
import { DrizzleModule } from './drizzle/drizzle.module'
import { InventoryModule } from './inventory/inventory.module'
import { PgClientModule } from './pg-client/pg-client.module'
import { TransactionTemplateModule } from './transaction-template/transaction-template.module'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: true,
      playground: true,
      sortSchema: true,
      resolvers: { JSON: GraphQLJSON },
      // formatError: (error: GraphQLFormattedError) => {
      //   const logger = new Logger();
      //   logger.error(error);
      //   const graphQLFormattedError: GraphQLFormattedError = {
      //     message: error?.message,
      //   };
      //   return graphQLFormattedError;
      // },
    }),
    EventEmitterModule.forRoot(),
    DrizzleModule,
    PgClientModule,
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
    InventoryModule,
    AccountsPayableModule,
    AccountsReceivableModule,
    TransactionTemplateModule,
  ],
  providers: [],
})
export class AppModule { }