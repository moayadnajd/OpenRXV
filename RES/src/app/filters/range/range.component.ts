import { Component, OnInit } from '@angular/core';
import { ComponentFilterConfigs } from 'src/configs/generalConfig.interface';
import { RangeService } from '../services/range/range.service';
import {
  ElasticsearchQuery,
  QueryYearAttribute,
  BuildQueryObj,
  ResetOptions,
  ResetCaller,
} from '../services/interfaces';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../store';
import { Observable } from 'rxjs';
import { ParentComponent } from 'src/app/parent-component.class';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  providers: [RangeService],
})
export class RangeComponent extends ParentComponent implements OnInit {
  range: number[];
  max: number;
  min: number;
  loading$: Observable<boolean>;
  disabled: boolean;
  private firstMax: number;
  private firstMin: number;
  private orOperator: boolean;

  constructor(
    private readonly rangeService: RangeService,
    private readonly store: Store<fromStore.AppState>
  ) {
    super();
    this.disabled = false;
    this.rangeService.storeVal = this.store;
  }

  ngOnInit(): void {
    const { source } = this.componentConfigs as ComponentFilterConfigs;
    this.rangeService.sourceVal = source;
    this.getYears();
    this.shouldReset();
    this.loading$ = this.store.select(fromStore.getLoadingStatus);
    this.subToOrOperator();
  }

  onYearSliderChange(): void {
    const query: bodybuilder.Bodybuilder = this.rangeService.addAttributeToMainQuery(
      {
        gte: this.range[0],
        lte: this.range[1],
      } as QueryYearAttribute
    );
    this.rangeService.resetNotification();
    this.store.dispatch(new fromStore.SetQuery(query.build()));
  }

  private subToOrOperator() {
    this.rangeService.orOperator.subscribe((b: boolean) => {
      this.orOperator = b;
      if (b) {
        this.min = this.firstMin;
        this.max = this.firstMax;
        this.disabled = false;
        this.range = [this.min, this.max];
      }
    });
  }

  private shouldReset(): void {
    /**
     * we will not get the years
     * when the user changes the range
     */
    this.rangeService.shouldReset.subscribe((ro: ResetOptions) => {
      if (ro.caller !== 'range') {
        // if the main query only have year
        // make the min and max as the first time
        if (
          Object.keys(this.rangeService.getAggAttributes).length === 1 &&
          this.rangeService.getAggAttributes['year.keyword']
        ) {
          this.min = this.firstMin;
          this.max = this.firstMax;
        } else {
          this.getYears(ro.caller);
        }
      }
    });
  }

  private getYears(caller?: ResetCaller): void {
    const qb: BuildQueryObj = {
      size: 100000,
    };
    this.rangeService
      .getYears(this.rangeService.buildquery(qb).build() as ElasticsearchQuery)
      .subscribe(
        (n: number[]) =>
          n.length
            ? this.setMinMaxLogic(+n[n.length - 1], +n[0])
            : this.noYearQuery() // some queries will return empty array
      );
  }

  private setMinMaxLogic(max: number, min: number): void {
    if (this.orOperator) {
      this.disabled = false;
      return;
    }

    if (min === max) {
      this.disabled = true;
      this.min = min - 1;
    } else {
      this.disabled = false;
      this.min = min;
    }
    this.max = max;
    this.setFirstMinMax(max, min);
    this.range = [min, max];
  }

  private setFirstMinMax(max: number, min: number): void {
    if (!this.range) {
      this.firstMax = max;
      this.firstMin = min;
    }
  }

  private noYearQuery(): void {
    this.disabled = true;
    this.min = 0;
    this.max = 1;
  }
}
