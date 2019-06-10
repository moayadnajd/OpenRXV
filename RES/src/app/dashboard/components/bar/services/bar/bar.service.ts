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
      .aggregation(
        'terms',
        'year.keyword',
        { size: 2147483647, order: { _term: 'asc' } },
        'y',
        query =>
          query.aggregation(
            'terms',
            '',
            {
              field: 'dc_type.keyword',
              size: 2147483647,
              order: {
                _count: 'desc',
              },
            },
            'x'
          )
      )
      .build() as ElasticsearchQuery;
  }
}
