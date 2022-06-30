import { CodeConsole } from './commands/code.console';
import { ProductConsole } from './commands/product.console';
import { MasterProductRecordEntity } from './entities/master.product.record.entity';

const es6Classes = {
    commands: [CodeConsole, ProductConsole],
    controllers: [],
    entities: [MasterProductRecordEntity],
    services: [],
};

export default es6Classes;
