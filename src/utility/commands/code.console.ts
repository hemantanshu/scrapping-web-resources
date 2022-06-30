import { Injectable } from '@nestjs/common';
import { QueueService, SqlService } from '@servicelabsco/nestjs-utility-services';
import axios from 'axios';
import { Command, Console } from 'nestjs-console';

@Injectable()
@Console()
export class CodeConsole {
    /**
     * Creates an instance of ModelScannerCommand.
     * @param {QueueService} queueService
     * @memberof ModelScannerCommand
     */
    constructor(private readonly queueService: QueueService, private readonly sqlService: SqlService) {}

    @Command({
        command: 'code:fix <arg1> <arg2>',
        description: 'run worker through sqs',
    })
    async fix(arg1: number, arg2: number) {
        // let counter = (await this.getMaxCounter()) + 1;
        global.console.log('arg1', arg1, arg2);
        return;
        let counter = arg1;
        let records = 0;
        let start = 0;

        const total = arg2 - arg1;

        while (true) {
            const data: any = await this.fetchData(counter);
            ++counter;
            ++start;

            if (counter > arg2) return;

            if (!data) {
                global.console.log(`skipping counter ${counter} : ${total - start} records : ${records}`);
                continue;
            }

            await this.loadDataIntoDb(data.body);
            records += data.body.length;

            global.console.log(`processed counter ${counter} : ${total - start} records : ${records}`);
        }
    }

    async fetchData(counter) {
        let url = `https://projecteagle.mydukaan.io/images`;
        url = counter ? `${url}?gtin=${counter}` : url;

        return new Promise((resolve, reject) => {
            const config: any = {
                method: 'get',
                url,
                headers: {
                    Authorization:
                        'Bearer Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYwNzcwODUyLCJqdGkiOiJjOGJjZTIxYjlmMTE0ODFlYWUxM2RjYjU3ZWE5NTE5ZiIsInVzZXJfaWQiOjY2OTQwNTIsImhhc19wYXNzd29yZF9zZXQiOnRydWUsImVtYWlsIjoicm9yb3NvNjgzMkBidW5sZXRzLmNvbSIsInVzZXJfYWN0aXZlIjp0cnVlLCJ1c2VyX2VtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1c2VybmFtZSI6InJvcm9zbzY4MzJAYnVubGV0cy5jb20iLCJidXllcl9pZCI6Njg0NDg3NCwic2VsbGVyX2lkIjo2NzEyNDE3LCJwaWxvdF9pZCI6Mjg3ODIyMCwidmVuZG9yX2lkIjpudWxsLCJidXllcl91dWlkIjoiYzZlYmE0ZjctMGRjMy00MTFjLTk1NTktY2M3NGYzZTJjYjc4Iiwic2VsbGVyX3V1aWQiOiIwMWVlYjNkOS0zOTIyLTQ1NmYtODUzMy0zY2U5NzE2ZjA5YzQiLCJwaWxvdF91dWlkIjoiMDEyYmM1ZDItNGZkNC00MTZjLWI2ZjMtMDMzMzdkZjI1NDY4IiwidmVuZG9yX3V1aWQiOm51bGwsInZlbmRvcl9kYXRlIjpudWxsLCJzdG9yZV91dWlkcyI6WyJiYjY2Yjc5OC0xMjZkLTRkMWItODRjNi1lMTIyYzNiNzAwYzciXSwic3RvcmVfaWRzIjpbMTAxOTczNzI0XSwic3RhZmZfaWQiOm51bGwsInN0b3JlX3R5cGUiOjAsImN1c3RvbV9kYXRhIjp7fX0.TohExO13xngNhxXf13tyhC3d6L1nS2aL-1_3PKdorK8',
                },
                Referer: 'https://web.mydukaan.io/',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
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

    async loadDataIntoDb(records: any[]) {
        const promises = [];

        records.forEach((record) => {
            //   const img = new ProductImageEntity();
            //   img.gtin = record.gtin;
            //   img.original_title = record.original_title || null;
            //   img.thumbnail_url = record.thumbnailUrl || null;
            //   img.original_url = record.original_url || null;
            //   img.search_title = record.search_title;
            //   img.s3_url = record.s3_url;
            //   promises.push(img.save());
        });

        return Promise.all(promises).then((res) => {
            return res;
        });
    }

    async getMaxCounter() {
        return 1652130019056;
        const sql = `select * from  delete_product_images order by created_at desc limit 1`;
        const records = await this.sqlService.sql(sql);

        return records.length ? +records[0].gtin : 0;
    }
}
