import { PageEvent } from '@angular/material';
import { SortOption } from 'src/configs/generalConfig.interface';
export interface SortPaginationOptions {
  reset: boolean;
  pageEvent: PageEvent;
  sortOption: SortOption;
}

export interface ViewChild {
  linkedId: string;
  compId: string;
}

export enum UpdateCallerBarChart {
  BarChartNgSelect,
  SideFilters,
}
