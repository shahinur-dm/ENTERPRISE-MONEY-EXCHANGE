import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CurrencyService } from './modules/currency/currency.service';

async function bootstrap() {
  const logger = new Logger('EnterpriseBootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Swagger UI inline scripts
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  app.enableCors({
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key', 'X-Requested-With'],
  });

  // Global API Prefix
  app.setGlobalPrefix('api/v1');

  // Strict Request Body Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Enterprise Money Exchange & International Remittance ERP API')
    .setDescription(
      'Institutional Banking & Remittance Engine with Double-Entry General Ledger, Multi-Currency Trading, Real-time WAC Inventory, and Compliance Controls.'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'Session lifecycle, JWT tokens, and TOTP 2FA')
    .addTag('Organization & Entities', 'Multi-tenant, multi-country, legal entities and branches')
    .addTag('Institutional Dashboard', 'Executive financial KPIs, positions, and operational alerts')
    .addTag('Financial Accounting & General Ledger', 'Double-entry journals, Chart of accounts, and Trial balance')
    .addTag('Currency & FX Operations', 'Spot trading, real-time WAC revaluation, and inventory pools')
    .addTag('Cross-Border Remittance & Payouts', '16-state transfer lifecycle and payout settlements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Seed initial exchange rates if missing
  try {
    const currencyService = app.get(CurrencyService);
    await currencyService.seedInitialRates();
  } catch (err: any) {
    logger.warn(`Initial rate seeding skipped: ${err?.message}`);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`=============================================================`);
  logger.log(`  ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP  `);
  logger.log(`  API Gateway running on: http://localhost:${port}/api/v1  `);
  logger.log(`  Swagger OpenAPI Docs at: http://localhost:${port}/api/docs `);
  logger.log(`=============================================================`);
}

bootstrap();
