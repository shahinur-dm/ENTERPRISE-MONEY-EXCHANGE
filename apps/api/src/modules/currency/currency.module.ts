import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Currency, CurrencySchema } from './schemas/currency.schema';
import { ExchangeRate, ExchangeRateSchema } from './schemas/exchange-rate.schema';
import { CurrencyCostPool, CurrencyCostPoolSchema } from './schemas/currency-cost-pool.schema';
import { CurrencyPurchase, CurrencyPurchaseSchema } from './schemas/currency-purchase.schema';
import { CurrencySale, CurrencySaleSchema } from './schemas/currency-sale.schema';
import { Party, PartySchema } from './schemas/party.schema';
import { CurrencyStockMovement, CurrencyStockMovementSchema } from './schemas/currency-stock-movement.schema';
import { FinancialAccount, FinancialAccountSchema } from './schemas/financial-account.schema';
import { FinancialTransaction, FinancialTransactionSchema } from './schemas/financial-transaction.schema';
import { BusinessExpense, BusinessExpenseSchema } from './schemas/business-expense.schema';
import { DailyClosing, DailyClosingSchema } from './schemas/daily-closing.schema';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
      { name: ExchangeRate.name, schema: ExchangeRateSchema },
      { name: CurrencyCostPool.name, schema: CurrencyCostPoolSchema },
      { name: CurrencyPurchase.name, schema: CurrencyPurchaseSchema },
      { name: CurrencySale.name, schema: CurrencySaleSchema },
      { name: Party.name, schema: PartySchema },
      { name: CurrencyStockMovement.name, schema: CurrencyStockMovementSchema },
      { name: FinancialAccount.name, schema: FinancialAccountSchema },
      { name: FinancialTransaction.name, schema: FinancialTransactionSchema },
      { name: BusinessExpense.name, schema: BusinessExpenseSchema },
      { name: DailyClosing.name, schema: DailyClosingSchema },
    ]),
    AccountingModule,
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
