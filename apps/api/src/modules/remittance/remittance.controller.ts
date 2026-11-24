import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RemittanceStatus } from '@erp/types';
import { RemittanceService, CreateRemittanceDto } from './remittance.service';

@ApiTags('Cross-Border Remittance & Payouts')
@Controller('remittance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RemittanceController {
  constructor(private readonly remittanceService: RemittanceService) {}

  @Get()
  @ApiOperation({ summary: 'List remittances with optional status or corridor filter' })
  async listRemittances(@Query('status') status?: RemittanceStatus) {
    const filter: any = {};
    if (status) filter.status = status;
    return this.remittanceService.listRemittances(filter);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create new cross-border remittance order with 15-min quote lock' })
  async createRemittance(@Body() dto: CreateRemittanceDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.remittanceService.createRemittance({
      ...dto,
      userId: dto.userId || userId,
    });
  }

  @Post(':id/collect')
  @ApiOperation({ summary: 'Collect funds from sender, generate double-entry journal, start screening' })
  async collectFunds(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.remittanceService.collectFunds(id, userId);
  }

  @Post(':id/transition')
  @ApiOperation({ summary: 'Advance state in the 16-state server machine with legal transition guard' })
  async transitionStatus(
    @Param('id') id: string,
    @Body('status') newStatus: RemittanceStatus,
    @Body('memo') memo: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.remittanceService.transitionStatus(id, newStatus, memo, userId);
  }

  @Post(':id/payout')
  @ApiOperation({ summary: 'Record external partner payout reference and finalize payout status' })
  async recordPayout(
    @Param('id') id: string,
    @Body('externalReference') externalReference: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.remittanceService.recordPayout(id, externalReference, userId);
  }
}
