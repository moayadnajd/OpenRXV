import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ComponentLookup } from '../../dynamic/lookup.registry';
import { ListComponent } from '../list.component';
import { Store } from '@ngrx/store';
import { ScrollHelperService } from '../../services/scrollTo/scroll-helper.service';
import * as fromStore from '../../../../store';
@ComponentLookup('MainListComponent')
@Component({
  selector: 'app-main-list',
  templateUrl: '../list.component.html',
  styleUrls: ['../list.component.scss'],
  providers: [ScrollHelperService],
})
export class MainListComponent extends ListComponent {

  constructor(public readonly store: Store<fromStore.AppState>,
    public readonly scrollHelperService: ScrollHelperService,
    public readonly cdr: ChangeDetectorRef) {
    super(store, scrollHelperService, cdr);
  }


}
