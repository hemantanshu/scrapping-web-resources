import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    AuthModule,
    BasicAuthMiddleware,
    JwtMiddleware,
    PlatformUtilityModule,
    RestrictedMiddleware,
    SecurityModule,
    ShutdownService,
    SystemModule,
} from '@servicelabsco/nestjs-utility-services';
import { CommandModule } from 'nestjs-command';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as ormconfig from './config/typeorm.config';
import { UtilityModule } from './utility/utility.module';
import queueConfig = require('./config/queue.config');
import { ConsoleModule } from 'nestjs-console';
import { WorkerService } from './worker.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(ormconfig),
        BullModule.forRoot(queueConfig),
        AuthModule,
        SecurityModule,
        UtilityModule,
        SystemModule,
        PlatformUtilityModule,
        TerminusModule,
        CommandModule,
        ConsoleModule,
    ],
    controllers: [AppController],
    providers: [AppService, ShutdownService, WorkerService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
        consumer.apply(BasicAuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
        consumer.apply(RestrictedMiddleware).forRoutes({ path: 'api/*', method: RequestMethod.ALL });
    }
}
