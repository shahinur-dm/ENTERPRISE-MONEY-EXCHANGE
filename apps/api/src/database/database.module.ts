import { Module, Global, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

let mongoMemoryServerInstance: any = null;

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        let uri = configService.get<string>('MONGO_URI');

        if (!uri || uri === 'memory') {
          try {
            logger.log('Starting local embedded MongoDB replica set for financial testing...');
            const { MongoMemoryReplSet } = await import('mongodb-memory-server');
            mongoMemoryServerInstance = await MongoMemoryReplSet.create({
              replSet: { count: 1, storageEngine: 'wiredTiger' },
            });
            uri = mongoMemoryServerInstance.getUri();
            logger.log(`Embedded MongoDB Replica Set active at: ${uri}`);
          } catch (err: any) {
            logger.warn(
              `Could not start embedded replica set (${err.message}). Falling back to local default mongodb://127.0.0.1:27017/money_exchange_erp`
            );
            uri = 'mongodb://127.0.0.1:27017/money_exchange_erp';
          }
        } else {
          logger.log(`Connecting to institutional MongoDB cluster at: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
        }

        return {
          uri,
          autoIndex: true,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
