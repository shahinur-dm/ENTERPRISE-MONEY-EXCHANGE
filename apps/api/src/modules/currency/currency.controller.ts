import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrencyService, ExecutePurchaseDto, ExecuteSaleDto } from './currency.service';

@ApiTags('Currency & FX Operations')
@Controller('currency')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get active exchange rates and spreads' })
  async getExchangeRates() {
    return this.currencyService.getExchangeRates();
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Execute foreign currency purchase with WAC re-valuation and balancing double-entry journal' })
  async executePurchase(@Body() dto: ExecutePurchaseDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.currencyService.executePurchase({
      ...dto,
      userId: dto.userId || userId,
    });
  }

  @Post('sale')
  @ApiOperation({ summary: 'Execute foreign currency sale with WAC COGS, realized profit, and balancing double-entry journal' })
  async executeSale(@Body() dto: ExecuteSaleDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.currencyService.executeSale({
      ...dto,
      userId: dto.userId || userId,
    });
  }
}
