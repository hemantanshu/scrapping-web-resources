import { MigrationUtility } from '@servicelabsco/nestjs-utility-services';

export class CreateMasterProductRecordTable1656599878977 extends MigrationUtility {
    constructor() {
        super('del_master_products');
        this.process();
    }

    process() {
        this.primary();

        this.char('identifier', 24);
        this.string('name');
        this.string('brand');

        this.string('unit');
        this.float('mrp', 20, 3);
        this.string('identification_code');
        this.float('gst', 10, 3);
        this.string('category');
        this.string('category_name');
        this.string('industry');
        this.string('barcode');
        this.string('company_id');

        this.json('attributes');
        this.whoColumns();

        this.index(['identifier'], 'del_master_products_identifier_index');
    }
}
