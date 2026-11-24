import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AccountingService, CreateJournalEntryDto } from './accounting.service';

@ApiTags('Financial Accounting & General Ledger')
@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('coa/:legalEntityId')
  @ApiOperation({ summary: 'Get Chart of Accounts for a legal entity' })
  async getChartOfAccounts(@Param('legalEntityId') legalEntityId: string) {
    return this.accountingService.getChartOfAccounts(legalEntityId);
  }

  @Get('trial-balance/:legalEntityId')
  @ApiOperation({ summary: 'Calculate real-time Trial Balance with Debit-Credit equilibrium assertion' })
  async getTrialBalance(@Param('legalEntityId') legalEntityId: string) {
    return this.accountingService.getTrialBalance(legalEntityId);
  }

  @Get('general-ledger/:legalEntityId')
  @ApiOperation({ summary: 'Get General Ledger audit records' })
  async getGeneralLedger(
    @Param('legalEntityId') legalEntityId: string,
    @Query('limit') limit?: number,
  ) {
    return this.accountingService.getGeneralLedger(legalEntityId, limit ? Number(limit) : 50);
  }

  @Post('journal-entry')
  @ApiOperation({ summary: 'Post balanced double-entry Journal Entry (BR-001 strictly enforced)' })
  async postJournalEntry(@Body() dto: CreateJournalEntryDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.accountingService.postJournalEntry({
      ...dto,
      postedBy: dto.postedBy || userId,
    });
  }

  @Post('journal-entry/:id/reverse')
  @ApiOperation({ summary: 'Reverse a posted Journal Entry (BR-002 Immutability rule)' })
  async reverseJournalEntry(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?._id || '000000000000000000000000';
    return this.accountingService.reverseJournalEntry(id, reason || 'Manual adjustment', userId);
  }
}
