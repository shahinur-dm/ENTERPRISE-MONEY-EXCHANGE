import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { Country, CountryDocument } from './schemas/country.schema';
import { LegalEntity, LegalEntityDocument } from './schemas/legal-entity.schema';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UserRoleType, BranchType, SystemStatus } from '@erp/types';

@Injectable()
export class OrganizationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    @InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>,
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
    @InjectModel(LegalEntity.name) private legalEntityModel: Model<LegalEntityDocument>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async onApplicationBootstrap() {
    await this.seedInstitutionalHierarchy();
  }

  async seedInstitutionalHierarchy() {
    try {
      const orgCount = await this.orgModel.countDocuments();
      if (orgCount > 0) {
        return; // Already initialized
      }

      this.logger.log('Seeding institutional hierarchy and enterprise foundation...');

      // 1. Organization
      const org = await this.orgModel.create({
        name: 'Dawat Enterprise Money Exchange & International Remittance Ltd',
        code: 'DAWAT-ERP',
        baseCurrency: 'USD',
        status: SystemStatus.ACTIVE,
      });

      // 2. Countries (Initial corridor: Malaysia -> Bangladesh)
      const malaysia = await this.countryModel.create({
        isoCode: 'MYS',
        iso2Code: 'MY',
        name: 'Malaysia',
        defaultCurrency: 'MYR',
        timezone: 'Asia/Kuala_Lumpur',
        status: SystemStatus.ACTIVE,
        regulatorySettings: {
          centralBank: 'Bank Negara Malaysia (BNM)',
          kycThresholdMyr: 3000,
          amlSingleTxLimitMyr: 50000,
        },
      });

      const bangladesh = await this.countryModel.create({
        isoCode: 'BGD',
        iso2Code: 'BD',
        name: 'Bangladesh',
        defaultCurrency: 'BDT',
        timezone: 'Asia/Dhaka',
        status: SystemStatus.ACTIVE,
        regulatorySettings: {
          centralBank: 'Bangladesh Bank',
          kycThresholdBdt: 100000,
          amlSingleTxLimitBdt: 500000,
        },
      });

      // 3. Legal Entities (Separated functional currencies & ledgers)
      const myEntity = await this.legalEntityModel.create({
        organizationId: org._id,
        countryId: malaysia._id,
        name: 'Dawat Remit SDN. BHD.',
        registrationNo: 'MY-2026-998811',
        licenseNo: 'BNM/MMS/2026/014',
        functionalCurrency: 'MYR',
        status: SystemStatus.ACTIVE,
      });

      const bdEntity = await this.legalEntityModel.create({
        organizationId: org._id,
        countryId: bangladesh._id,
        name: 'Dawat Exchange Bangladesh Ltd.',
        registrationNo: 'BD-C-2026-114422',
        licenseNo: 'BB/FEPD/2026/088',
        functionalCurrency: 'BDT',
        status: SystemStatus.ACTIVE,
      });

      // 4. Initial Branches
      const kulBranch = await this.branchModel.create({
        organizationId: org._id,
        legalEntityId: myEntity._id,
        code: 'KUL-01',
        name: 'Kuala Lumpur Central Branch',
        type: BranchType.HEAD_OFFICE,
        address: {
          street: 'Jalan Bukit Bintang, Suite 12-04',
          city: 'Kuala Lumpur',
          state: 'Wilayah Persekutuan',
          postalCode: '55100',
          countryCode: 'MY',
        },
        phone: '+60 3-2145 8899',
        email: 'kul.branch@dawatremit.com',
        status: SystemStatus.ACTIVE,
      });

      const dhkBranch = await this.branchModel.create({
        organizationId: org._id,
        legalEntityId: bdEntity._id,
        code: 'DHK-01',
        name: 'Dhaka Motijheel Principal Branch',
        type: BranchType.HEAD_OFFICE,
        address: {
          street: '48 Dilkusha Commercial Area',
          city: 'Dhaka',
          state: 'Dhaka Division',
          postalCode: '1000',
          countryCode: 'BD',
        },
        phone: '+880 2-9568741',
        email: 'dhaka.hq@dawatexchange.com',
        status: SystemStatus.ACTIVE,
      });

      const ctgBranch = await this.branchModel.create({
        organizationId: org._id,
        legalEntityId: bdEntity._id,
        code: 'CTG-01',
        name: 'Chittagong Agrabad Branch',
        type: BranchType.RETAIL_BRANCH,
        address: {
          street: 'Agrabad Commercial Area',
          city: 'Chittagong',
          postalCode: '4100',
          countryCode: 'BD',
        },
        phone: '+880 31-712345',
        email: 'ctg.branch@dawatexchange.com',
        status: SystemStatus.ACTIVE,
      });

      // 5. Seed Core Institutional Users
      const salt = await bcrypt.genSalt(10);
      const masterAdminPass = await bcrypt.hash('Admin@123456', salt);
      const accountantPass = await bcrypt.hash('Accountant@123456', salt);
      const agentPass = await bcrypt.hash('Agent@123456', salt);
      const compliancePass = await bcrypt.hash('Compliance@123456', salt);

      await this.userModel.create([
        {
          organizationId: org._id,
          name: 'Chief Executive Master Admin',
          email: 'admin@moneyexchange.com',
          passwordHash: masterAdminPass,
          phone: '+60 12-345-6789',
          role: UserRoleType.MASTER_ADMIN,
          twoFactorEnabled: false,
          allowedBranches: [kulBranch._id, dhkBranch._id, ctgBranch._id],
          status: SystemStatus.ACTIVE,
        },
        {
          organizationId: org._id,
          name: 'Senior Financial Accountant',
          email: 'accountant@moneyexchange.com',
          passwordHash: accountantPass,
          phone: '+880 1711-223344',
          role: UserRoleType.ACCOUNTANT,
          twoFactorEnabled: false,
          allowedBranches: [kulBranch._id, dhkBranch._id],
          status: SystemStatus.ACTIVE,
        },
        {
          organizationId: org._id,
          name: 'Kuala Lumpur Operational Agent',
          email: 'agent.kul@moneyexchange.com',
          passwordHash: agentPass,
          phone: '+60 18-987-6543',
          role: UserRoleType.AGENT,
          twoFactorEnabled: false,
          allowedBranches: [kulBranch._id],
          status: SystemStatus.ACTIVE,
        },
        {
          organizationId: org._id,
          name: 'Institutional Compliance Officer',
          email: 'compliance@moneyexchange.com',
          passwordHash: compliancePass,
          phone: '+60 11-2233-4455',
          role: UserRoleType.COMPLIANCE_OFFICER,
          twoFactorEnabled: false,
          allowedBranches: [kulBranch._id, dhkBranch._id, ctgBranch._id],
          status: SystemStatus.ACTIVE,
        },
      ]);

      this.logger.log('Institutional seed completed successfully.');
    } catch (err: any) {
      this.logger.error(`Error during institutional hierarchy seed: ${err.message}`);
    }
  }

  async getOrganizations() {
    return this.orgModel.find();
  }

  async getCountries() {
    return this.countryModel.find();
  }

  async getLegalEntities(organizationId?: string) {
    const filter = organizationId ? { organizationId } : {};
    return this.legalEntityModel.find(filter).populate('countryId');
  }

  async getBranches(legalEntityId?: string) {
    const filter = legalEntityId ? { legalEntityId } : {};
    return this.branchModel.find(filter).populate('legalEntityId');
  }

  async getBranchById(id: string) {
    return this.branchModel.findById(id).populate('legalEntityId');
  }
}
