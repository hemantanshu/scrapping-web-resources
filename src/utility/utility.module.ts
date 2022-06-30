import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformUtilityModule } from '@servicelabsco/nestjs-utility-services';
import { ConsoleModule } from 'nestjs-console';
import es6Classes from './es6.classes';

@Module({
    imports: [TypeOrmModule.forFeature(es6Classes.entities), PlatformUtilityModule, UtilityModule, ConsoleModule],
    providers: [...es6Classes.commands],
})
export class UtilityModule {}
