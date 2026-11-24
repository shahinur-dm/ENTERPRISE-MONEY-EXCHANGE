import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Organization & Entities')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'List organizations' })
  async getOrganizations() {
    return this.orgService.getOrganizations();
  }

  @Get('countries')
  @ApiOperation({ summary: 'List operating countries and regulatory thresholds' })
  async getCountries() {
    return this.orgService.getCountries();
  }

  @Get('legal-entities')
  @ApiOperation({ summary: 'List legal entities with functional currencies' })
  async getLegalEntities(@Query('organizationId') orgId?: string) {
    return this.orgService.getLegalEntities(orgId);
  }

  @Get('branches')
  @ApiOperation({ summary: 'List operational branches' })
  async getBranches(@Query('legalEntityId') legalEntityId?: string) {
    return this.orgService.getBranches(legalEntityId);
  }

  @Get('branches/:id')
  @ApiOperation({ summary: 'Get branch details by ID' })
  async getBranchById(@Param('id') id: string) {
    return this.orgService.getBranchById(id);
  }
}
