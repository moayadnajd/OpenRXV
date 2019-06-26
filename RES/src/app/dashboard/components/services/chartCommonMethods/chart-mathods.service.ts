import { Injectable, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {
  ComponentDashboardConfigs,
  MergedSelect,
} from 'src/configs/generalConfig.interface';
import { Observable, merge } from 'rxjs';
import * as fromStore from '../../../../../store';
import { Store } from '@ngrx/store';
import { ChartHelper } from '../chart/chart-helper.class';
import { ScrollHelperService } from '../scrollTo/scroll-helper.service';
import { first, map } from 'rxjs/operators';
import { Bucket } from 'src/app/filters/services/interfaces';
import { ViewState } from 'src/store/reducers/items.reducer';

@Injectable()
export class ChartMathodsService extends ChartHelper {
  private loadingHits$: Observable<boolean>;
  private cc: ComponentDashboardConfigs;
  private readonly shs: ScrollHelperService;
  goBuildDataSeries: EventEmitter<Bucket[] | MergedSelect>;

  get getExpanded(): boolean {
    return this.shs.expandedStatus;
  }

  get getLoadingHits$(): Observable<boolean> {
    return this.loadingHits$;
  }

  set setExpanded(expan: boolean) {
    this.shs.expandedVal = expan;
  }

  get getViewState(): ViewState {
    return this.shs.getViewState;
  }

  get getLoading(): boolean {
    return this.shs.getLoading;
  }

  constructor(
    private readonly store: Store<fromStore.ItemsState>,
    private readonly cdr: ChangeDetectorRef
  ) {
    super();
    this.shs = new ScrollHelperService(cdr);
    this.goBuildDataSeries = new EventEmitter();
  }

  init(chartType: string, cc: ComponentDashboardConfigs, cb?: () => any): void {
    this.chartType = chartType;
    this.cc = cc;
    this.shs.storeVal = this.store;
    this.shs.seeIfThisCompInView(this.cc.id);
    this.shs.dataIsReadyArrived.pipe(first()).subscribe(() => {
      if (cb) {
        cb();
      }
      this.subToDataFromStore();
    });
  }

  disPatchSetInView(collapsed: boolean): void {
    this.shs.disPatchSetInView(this.cc.id, collapsed);
  }

  private subToDataFromStore(): void {
    if (Array.isArray(this.cc.source)) {
      const observableArr: Array<Observable<MergedSelect>> = [];
      (this.cc.source as Array<string>).forEach((s: string) => {
        observableArr.push(
          this.store
            .select(fromStore.getBuckets, s)
            .pipe(map((buckets: Bucket[]) => ({ [s]: buckets })))
        );
      });
      merge(...observableArr).subscribe((ms: MergedSelect) => {
        const [key] = Object.keys(ms);
        if (ms[key]) {
          this.goBuildDataSeries.emit(ms);
        }
      });
    } else {
      this.store
        .select(fromStore.getBuckets, this.cc.source)
        .subscribe((b: Bucket[]) => this.goBuildDataSeries.emit(b));
    }
    this.loadingHits$ = this.store.select(fromStore.getLoadingOnlyHits);
  }
}
