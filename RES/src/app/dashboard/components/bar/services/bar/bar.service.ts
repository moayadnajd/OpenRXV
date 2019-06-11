import { Injectable } from '@angular/core';
import { BodyBuilderService } from 'src/app/filters/services/bodyBuilder/body-builder.service';
import * as bodybuilder from 'bodybuilder';
import { ElasticsearchQuery } from 'src/app/filters/services/interfaces';
@Injectable()
export class BarService {
  constructor(private readonly bodyBuilderService: BodyBuilderService) {}

  buildQuery(): ElasticsearchQuery {
    return bodybuilder()
      .size(0)
      .aggregation('terms', 'year.keyword', { size: 5 }, 'y', query =>
        query.aggregation(
          'terms',
          '',
          {
            field: 'type.keyword',
            size: 5,
          },
          'x'
        )
      )
      .build() as ElasticsearchQuery;
  }
}
