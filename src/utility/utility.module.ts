import { Module } from '@nestjs/common';
import { PlatformUtilityModule } from '@servicelabsco/nestjs-utility-services';
import { ConsoleModule } from 'nestjs-console';
import { CodeConsole } from './commands/code.console';

@Module({
  imports: [PlatformUtilityModule, UtilityModule, ConsoleModule],
  providers: [CodeConsole],
})
export class UtilityModule {}
