import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Bucket } from 'src/app/filters/services/interfaces';
import * as fromStore from '../../../../../store';
import { Observable } from 'rxjs/index';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-virtual-list',
  templateUrl: './virtual-list.component.html',
  styleUrls: ['./virtual-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualListComponent {
  @Input() listData: Bucket[];
  public totalItems: Observable<number>;

  constructor(private readonly store: Store<fromStore.AppState>) {
    this.initPercantageLogic();
  }

  private initPercantageLogic() {
    this.totalItems = this.store.select(fromStore.getTotal);
    // this.store
    //   .select(fromStore.getTotal).subscribe((total => alert(total)));
  }
}
