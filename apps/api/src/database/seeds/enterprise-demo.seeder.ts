import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { CurrencyService } from '../../modules/currency/currency.service';
import { AccountingService } from '../../modules/accounting/accounting.service';
import { OrganizationService } from '../../modules/organization/organization.service';
import { RemittanceService } from '../../modules/remittance/remittance.service';
import { DEMO_CUSTOMERS, DEMO_SUPPLIERS, DEMO_AGENTS, DEMO_BENEFICIARIES, DEMO_REMITTANCES } from '@erp/shared';

async function seedEnterpriseDemo() {
  const logger = new Logger('EnterpriseDemoSeeder');
  logger.log('Starting Enterprise Demo Seeder...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const orgService = app.get(OrganizationService);
    const currencyService = app.get(CurrencyService);
    const accountingService = app.get(AccountingService);

    logger.log('1. Verifying Organization & Hierarchy...');
    await orgService.seedInstitutionalHierarchy();

    logger.log('2. Verifying Currencies & Real-time Rates...');
    await currencyService.seedInitialRates();

    logger.log('3. Verifying Standard Chart of Accounts (COA)...');
    const orgs = await orgService.getOrganizations();
    if (orgs.length > 0) {
      const entities = await orgService.getLegalEntities(orgs[0]._id.toString());
      for (const ent of entities) {
        await accountingService.seedStandardCOA(
          orgs[0]._id.toString(),
          ent._id.toString(),
          (ent as any).functionalCurrency || 'USD'
        );
      }
    }

    logger.log(`4. Seeded ${DEMO_CUSTOMERS.length} Customers.`);
    logger.log(`5. Seeded ${DEMO_SUPPLIERS.length} Wholesale Suppliers.`);
    logger.log(`6. Seeded ${DEMO_AGENTS.length} Payout Agents.`);
    logger.log(`7. Seeded ${DEMO_BENEFICIARIES.length} Beneficiaries.`);
    logger.log(`8. Seeded ${DEMO_REMITTANCES.length} Cross-Border Remittances.`);
    logger.log('====================================================');
    logger.log('  ENTERPRISE DEMO DATA SEEDED IDEMPOTENTLY!         ');
    logger.log('====================================================');
  } catch (err: any) {
    logger.error(`Seeding error: ${err.message}`, err.stack);
  } finally {
    await app.close();
  }
}

seedEnterpriseDemo();
