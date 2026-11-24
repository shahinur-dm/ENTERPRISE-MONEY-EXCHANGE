import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { Country, CountrySchema } from './schemas/country.schema';
import { LegalEntity, LegalEntitySchema } from './schemas/legal-entity.schema';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Country.name, schema: CountrySchema },
      { name: LegalEntity.name, schema: LegalEntitySchema },
      { name: Branch.name, schema: BranchSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
