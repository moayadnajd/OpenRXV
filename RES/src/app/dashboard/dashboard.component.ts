import { Component, OnInit } from '@angular/core';
import { dashboardConfig } from '../../configs/dashboard';
import { countersConfig } from 'src/configs/counters';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { SetQuery } from '../../store';
import { BodyBuilderService } from '../filters/services/bodyBuilder/body-builder.service';
import { tourConfig } from 'src/configs/tour';
import { ComponentsIdsToScroll } from 'src/configs/generalConfig.interface';
import { ESHttpError } from 'src/store/actions/actions.interfaces';
import { MatSnackBar } from '@angular/material';
import { SnackComponent } from './representationalComponents/snack/snack.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardConfig = dashboardConfig;
  countersConfig = countersConfig;
  tourConfig = tourConfig;
  oldViewState: Map<string, boolean>;

  constructor(
    private readonly store: Store<fromStore.AppState>,
    private readonly bodyBuilderService: BodyBuilderService,
    private readonly snackBar: MatSnackBar
  ) {
    this.oldViewState = new Map<string, boolean>();
    Object.keys(ComponentsIdsToScroll).forEach((key: string) =>
      this.oldViewState.set(key, false)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(
      new SetQuery(this.bodyBuilderService.buildMainQuery().build())
    );
    this.store
      .select(fromStore.getErrors)
      .subscribe(
        (e: ESHttpError) =>
          e &&
          (this.snackBar.openFromComponent(SnackComponent).instance.error =
            e.error)
      );
  }

  onInViewportChange(inViewport: boolean, id: string): void {
    const [realId, linkedWith] = id.split('.');
    if (
      this.oldViewState.has(realId) &&
      this.oldViewState.get(realId) !== inViewport
    ) {
      this.oldViewState.set(realId, inViewport);
      this.store.dispatch(
        new fromStore.SetInView({
          viewState: {
            userSeesMe: inViewport,
            linkedWith: linkedWith === 'undefined' ? realId : linkedWith,
          },
          id: realId,
        })
      );
    }
  }
}
