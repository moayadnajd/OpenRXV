import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  searchOptions,
  ComponentSearchConfigs,
} from 'src/configs/generalConfig.interface';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../store';
import { QuerySearchAttribute } from '../services/interfaces';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { BodyBuilderService } from '../services/bodyBuilder/body-builder.service';
import { ParentComponent } from 'src/app/parent-component.class';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends ParentComponent implements OnInit {
  @ViewChild('search') searchInput: ElementRef;
  searchTerm: string;

  constructor(
    private readonly bodyBuilderService: BodyBuilderService,
    private readonly store: Store<fromStore.AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.subToSearchTerms();
    this.subToOrOperator();
  }

  onClick() {
    if (this.checkIfInputIsEmpty()) {
      this.checkTypeThenDelete();
      return;
    }
    this.applySearchTerm();
  }

  private deleteFromMainQuery(allSearch: boolean): string {
    return this.bodyBuilderService.deleteFromMainQuery(allSearch);
  }

  private applySearchTerm(): void {
    const { type } = this.componentConfigs as ComponentSearchConfigs;
    if (type === searchOptions.allSearch) {
      this.bodyBuilderService.setAggAttributes = {
        fuzziness: 'AUTO',
        operator: 'and',
        query: this.searchTerm,
      } as QuerySearchAttribute;
    } else {
      this.bodyBuilderService.setAggAttributes = this.searchTerm;
    }
    this.dispatchActions();
  }

  private checkTypeThenDelete() {
    let thereWasATerm: string;
    const { type } = this.componentConfigs as ComponentSearchConfigs;
    if (type === searchOptions.allSearch) {
      thereWasATerm = this.deleteFromMainQuery(true);
    } else {
      thereWasATerm = this.deleteFromMainQuery(false);
    }
    if (thereWasATerm === undefined) {
      return;
    }
    this.dispatchActions();
  }

  private dispatchActions() {
    this.bodyBuilderService.resetOtherComponent({ caller: 'search' });
    this.store.dispatch(
      new fromStore.SetQuery(this.bodyBuilderService.buildMainQuery().build())
    );
  }

  /**
   * this method will handle if the user
   * clears the input
   */
  private subToSearchTerms() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((e: any) => e.target.value),
        debounceTime(250),
        map((s: string) => {
          if (this.checkIfInputIsEmpty()) {
            this.checkTypeThenDelete();
          }
        })
      )
      .subscribe();
  }

  private checkIfInputIsEmpty(): boolean {
    return this.searchTerm === undefined || this.searchTerm.trim() === '';
  }

  private subToOrOperator(): void {
    this.bodyBuilderService.orOperator.subscribe((b: boolean) => {
      if (this.searchTerm !== undefined && this.searchTerm.length) {
        this.applySearchTerm();
      }
    });
  }
}
