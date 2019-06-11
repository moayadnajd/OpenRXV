import { PageEvent } from '@angular/material';
import { SortOption } from 'src/configs/generalConfig.interface';
import { Observable } from 'rxjs';
import { Bucket } from 'src/app/filters/services/interfaces';

export interface SortPaginationOptions {
  reset: boolean;
  pageEvent: PageEvent;
  sortOption: SortOption;
}

export interface MergedSelect {
  [key: string]: Array<Bucket>;
}
