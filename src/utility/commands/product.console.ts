import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Command, Console } from 'nestjs-console';
import { MasterProductRecordEntity } from '../entities/master.product.record.entity';

@Injectable()
@Console()
export class ProductConsole {
    private counter: number = 0;
    /**
     * Creates an instance of ModelScannerCommand.
     * @memberof ProductConsole
     */
    constructor() {}

    @Command({
        command: 'scrap:product',
        description: 'run worker through sqs',
    })
    async fix() {
        for (let i = 111; i < 122; ++i) {
            const str = String.fromCharCode(i);
            await this.process(1, str);
        }

        for (let i = 0; i < 10; ++i) {
            await this.process(1, i);
        }

        process.exit(1);
    }

    async process(page: number, search) {
        while (true) {
            const data: any = await this.fetchData(page, search);
            if (!data.data.length) return;

            global.console.log('data-length : ', search, page, this.counter, data.data.length);
            await this.loadDataIntoDb(data.data, page);
            ++page;
        }
    }

    async fetchData(page: number, str: string) {
        const url = `https://mybillbook.in/api/web/product_library/products?industry_name=general_store&page=${page}&search_term=${str}&per_page=50`;

        return new Promise((resolve, reject) => {
            const config = {
                method: 'get',
                url,
                headers: {
                    'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                    'sec-ch-ua-mobile': '?0',
                    Authorization:
                        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNTc4ZjUyNjEtNjY3OS00NWMxLWE2ZTktZjZmNWMzYjllZTQzIiwicHJlZml4IjoxNzk3MjQ1NzcxLCJleHAiOjE2NTkxODk3MTMsInN1YiI6IjU3OGY1MjYxLTY2NzktNDVjMS1hNmU5LWY2ZjVjM2I5ZWU0MyIsImF1ZCI6Im1iYi1yZWFsbS1wcm9kLWtxdG50IiwidXNlcl9kYXRhIjp7Im5hbWUiOiI1NzhmNTI2MS02Njc5LTQ1YzEtYTZlOS1mNmY1YzNiOWVlNDMifX0.wuNrRu_r0q2rkeD-exGn4da_GsyhNvfQgQILyw2097c',
                    client: 'web',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'company-id': '2c23e0da-14c0-4014-91a0-d94cb88d09d8',
                    'User-Agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                    'sec-ch-ua-platform': '"macOS"',
                    host: 'mybillbook.in',
                },
            };

            axios(config)
                .then((response) => {
                    return resolve(response.data);
                })
                .catch((error) => {
                    resolve(null);
                });
        });
    }

    async loadDataIntoDb(records: any[], page: number) {
        const promises = [];

        records.forEach((record) => {
            promises.push(this.setProduct(record, page));
        });

        return Promise.all(promises).then((res) => {
            return res;
        });
    }

    private async setProduct(record: any, page: number) {
        const identifier = record._id['$oid'];
        const product = await MasterProductRecordEntity.firstOrNew({ identifier });

        if (product.id) return product;

        product.name = record.product_name;
        product.brand = record.brand_name;
        product.unit = record.unit;
        product.mrp = record.mrp;
        product.identification_code = record.identification_code;
        product.gst = record.gst;
        product.category = record.category;
        product.category_name = record.category_display_name;
        product.industry = record.industry_name;
        product.company_id = record.company_id;
        product.barcode = record.barcode;

        ++this.counter;
        global.console.log('product.name', page, this.counter, product.name);

        return product.save();
    }
}
