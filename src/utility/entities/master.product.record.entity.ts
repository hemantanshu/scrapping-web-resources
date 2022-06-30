import { Column, Entity } from 'typeorm';
import { CommonEntity } from '@servicelabsco/nestjs-utility-services';

/**
 * entity definition against the del_master_products table
 * @export
 * @class MasterProductRecordEntity
 * @extends {CommonEntity}
 */
@Entity('del_master_products')
export class MasterProductRecordEntity extends CommonEntity {
    @Column()
    identifier: string;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column()
    unit: string;

    @Column()
    mrp: number;

    @Column()
    identification_code: string;

    @Column()
    gst: number;

    @Column()
    category: string;

    @Column()
    category_name: string;

    @Column()
    industry: string;

    @Column()
    barcode: string;

    @Column()
    company_id: string;

    @Column('json')
    attributes: any;

    /** all related methods to go below this */
}
