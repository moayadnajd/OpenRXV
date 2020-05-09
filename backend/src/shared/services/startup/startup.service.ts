import { Injectable } from '@nestjs/common';
import { ElasticService } from '../elastic/elastic.service';

@Injectable()
export class StartupService {
    constructor(private elsticsearch: ElasticService) {
        console.log("ElasticService ------------- init");
       this.elsticsearch.startup();
    }
}
