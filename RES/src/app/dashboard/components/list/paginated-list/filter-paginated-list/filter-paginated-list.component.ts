import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SortOption } from 'src/configs/generalConfig.interface';

@Component({
  selector: 'app-filter-paginated-list',
  templateUrl: './filter-paginated-list.component.html',
  styleUrls: ['./filter-paginated-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPaginatedListComponent implements OnInit {
  @Output() filterChanged: EventEmitter<SortOption>;
  @Input() filterOptions: SortOption[];
  selectedFilter: SortOption;
  ascDesc: SortOption[];
  reverseOption: string;

  constructor() {
    this.filterChanged = new EventEmitter();
  }

  ngOnInit(): void {
    this.ascDesc = [
      {
        display: 'Descending',
        value: 'desc',
      },
      {
        display: 'Ascending',
        value: 'asc',
      },
    ];
    this.reverseOption = this.ascDesc[0].value;
    this.selectedFilter = this.filterOptions[0];
  }

  onFilterChanged(f: SortOption): void {
    this.filterChanged.emit(f);
  }

  reverse(s: SortOption): void {
    this.filterOptions = this.filterOptions.map((so: SortOption) => {
      so.sort = s.value as 'asc' | 'desc';
      return so;
    });
    this.onFilterChanged(this.selectedFilter);
  }
}
