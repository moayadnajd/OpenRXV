import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Bucket } from 'src/app/filters/services/interfaces';
import * as fromStore from '../../../../../store';
import { Store } from '@ngrx/store';
import { ScreenSizeService } from 'src/services/screenSize/screen-size.service';

@Component({
  selector: 'app-virtual-list',
  templateUrl: './virtual-list.component.html',
  styleUrls: ['./virtual-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualListComponent implements OnInit {
  @Input() listData: Bucket[];
  totalItems: number;

  get isSmall(): boolean {
    return this.screenSizeService.isSmallScreen;
  }

  constructor(
    private readonly store: Store<fromStore.AppState>,
    private readonly screenSizeService: ScreenSizeService
  ) {}

  ngOnInit(): void {
    this.store
      .select<number>(fromStore.getTotal)
      .subscribe((total: number) => (this.totalItems = total));
  }
}
