import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CurrencyService,
  ExecutePurchaseDto,
  ExecuteSaleDto,
  CustomerPaymentDto,
  BuyerReceiptDto,
  AccountTransferDto,
  RecordExpenseDto,
  DailyClosingDto,
} from './currency.service';
import { PartyType } from '@erp/types';

@ApiTags('Currency Trading & Money Exchange ERP')
@Controller('currency')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  /* -------------------------------------------------------------------------- */
  /* 1. CURRENCIES & RATES                                                      */
  /* -------------------------------------------------------------------------- */

  @Get('currencies')
  @ApiOperation({ summary: 'Get all supported currencies' })
  async getCurrencies() {
    return this.currencyService.getCurrencies();
  }

  @Get('rates')
  @ApiOperation({ summary: 'Get active exchange rates and spreads' })
  async getExchangeRates() {
    return this.currencyService.getExchangeRates();
  }

  @Post('rates')
  @ApiOperation({ summary: 'Update or set exchange rate for currency pair' })
  async updateRate(
    @Body() dto: { pairSymbol: string; buyRate: string; sellRate: string },
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.updateExchangeRate(dto.pairSymbol, dto.buyRate, dto.sellRate, userId);
  }

  /* -------------------------------------------------------------------------- */
  /* 2. INVENTORY & STOCK                                                       */
  /* -------------------------------------------------------------------------- */

  @Get('stock')
  @ApiOperation({ summary: 'Get multi-currency inventory stock, WAC, and valuation in BDT' })
  async getStockSummary() {
    return this.currencyService.getStockSummary();
  }

  @Get('stock/ledger')
  @ApiOperation({ summary: 'Get immutable stock ledger movements for a currency' })
  async getStockLedger(
    @Query('currency') currency: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.currencyService.getStockLedger(currency || 'MYR', fromDate, toDate);
  }

  /* -------------------------------------------------------------------------- */
  /* 3. CURRENCY PURCHASES (FX BUY)                                             */
  /* -------------------------------------------------------------------------- */

  @Post('purchase')
  @ApiOperation({ summary: 'Execute foreign currency purchase from customer/supplier' })
  async executePurchase(@Body() dto: ExecutePurchaseDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.executePurchase({
      ...dto,
      userId: dto.userId || userId,
    });
  }

  @Get('purchases')
  @ApiOperation({ summary: 'Get purchase history with filtering' })
  async getPurchases(
    @Query('currency') currency?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.currencyService.getPurchasesReport(fromDate, toDate, currency);
  }

  @Post('purchase/:id/reverse')
  @ApiOperation({ summary: 'Reverse a completed currency purchase' })
  async reversePurchase(
    @Param('id') id: string,
    @Body() dto: { reason: string },
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.reversePurchase(id, dto.reason || 'Operator requested reversal', userId);
  }

  /* -------------------------------------------------------------------------- */
  /* 4. CURRENCY SALES (FX SELL)                                                */
  /* -------------------------------------------------------------------------- */

  @Post('sale')
  @ApiOperation({ summary: 'Execute foreign currency sale to customer/dealer with WAC COGS' })
  async executeSale(@Body() dto: ExecuteSaleDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.executeSale({
      ...dto,
      userId: dto.userId || userId,
    });
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales history with profit details' })
  async getSales(
    @Query('currency') currency?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.currencyService.getSalesReport(fromDate, toDate, currency);
  }

  @Post('sale/:id/reverse')
  @ApiOperation({ summary: 'Reverse a completed currency sale' })
  async reverseSale(
    @Param('id') id: string,
    @Body() dto: { reason: string },
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.reverseSale(id, dto.reason || 'Operator requested reversal', userId);
  }

  /* -------------------------------------------------------------------------- */
  /* 5. PARTIES & LEDGERS                                                       */
  /* -------------------------------------------------------------------------- */

  @Get('parties')
  @ApiOperation({ summary: 'Get customers, dealers, or all parties' })
  async getParties(@Query('type') type?: PartyType) {
    return this.currencyService.getParties(type);
  }

  @Post('parties')
  @ApiOperation({ summary: 'Register a new customer or dealer' })
  async createParty(@Body() dto: any) {
    return this.currencyService.createParty(dto);
  }

  @Get('parties/:id/ledger')
  @ApiOperation({ summary: 'Get party transaction ledger statement' })
  async getPartyLedger(
    @Param('id') id: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.currencyService.getPartyLedger(id, fromDate, toDate);
  }

  /* -------------------------------------------------------------------------- */
  /* 6. SETTLEMENT PAYMENTS & RECEIPTS                                          */
  /* -------------------------------------------------------------------------- */

  @Post('payment/customer')
  @ApiOperation({ summary: 'Pay outstanding balance to customer' })
  async recordCustomerPayment(@Body() dto: CustomerPaymentDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.executeCustomerPayment({ ...dto, userId: dto.userId || userId });
  }

  @Post('receipt/buyer')
  @ApiOperation({ summary: 'Receive outstanding payment from buyer/dealer' })
  async recordBuyerReceipt(@Body() dto: BuyerReceiptDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.executeBuyerReceipt({ ...dto, userId: dto.userId || userId });
  }

  /* -------------------------------------------------------------------------- */
  /* 7. CASH, BANK & EXPENSES                                                   */
  /* -------------------------------------------------------------------------- */

  @Get('accounts')
  @ApiOperation({ summary: 'Get financial accounts (Cash, Bank, Vault)' })
  async getFinancialAccounts() {
    return this.currencyService.getFinancialAccounts();
  }

  @Post('accounts/transfer')
  @ApiOperation({ summary: 'Transfer funds between cash/bank accounts' })
  async executeTransfer(@Body() dto: AccountTransferDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.executeAccountTransfer({ ...dto, userId: dto.userId || userId });
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Get business expenses' })
  async getExpenses(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('category') category?: string,
  ) {
    return this.currencyService.getExpenses(fromDate, toDate, category);
  }

  @Post('expenses')
  @ApiOperation({ summary: 'Record business expense' })
  async recordExpense(@Body() dto: RecordExpenseDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.recordExpense({ ...dto, userId: dto.userId || userId });
  }

  /* -------------------------------------------------------------------------- */
  /* 8. DAILY CLOSING & METRICS                                                 */
  /* -------------------------------------------------------------------------- */

  @Get('closing/status')
  @ApiOperation({ summary: 'Get daily closing preview / status for a date' })
  async getClosingStatus(@Query('date') date?: string) {
    const d = date || new Date().toISOString().split('T')[0];
    return this.currencyService.getDailyClosingStatus(d);
  }

  @Post('closing')
  @ApiOperation({ summary: 'Perform daily business closing' })
  async performDailyClosing(@Body() dto: DailyClosingDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'SYSTEM';
    return this.currencyService.performDailyClosing({ ...dto, userId: dto.userId || userId });
  }

  @Get('dashboard/metrics')
  @ApiOperation({ summary: 'Get live trading dashboard metrics' })
  async getDashboardMetrics() {
    return this.currencyService.getDashboardMetrics();
  }
}
