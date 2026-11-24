import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthSessionPayload } from '@erp/types';

@ApiTags('Institutional Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get enterprise consolidated KPIs, fund totals, and profit trends' })
  async getSummary(
    @CurrentUser() user: AuthSessionPayload,
    @Query('scope') scope?: string
  ) {
    return this.dashboardService.getDashboardSummary(scope || user.role);
  }
}
