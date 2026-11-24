import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Remittance, RemittanceSchema } from './schemas/remittance.schema';
import { RemittanceService } from './remittance.service';
import { RemittanceController } from './remittance.controller';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Remittance.name, schema: RemittanceSchema }]),
    AccountingModule,
  ],
  controllers: [RemittanceController],
  providers: [RemittanceService],
  exports: [RemittanceService],
})
export class RemittanceModule {}
