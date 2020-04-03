import { Component, OnInit } from '@angular/core';
import { dashboardConfig } from '../configs/dashboard';
import { countersConfig } from 'src/app/explorer/configs/counters';
import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import { SetQuery } from '../store';
import { BodyBuilderService } from '../filters/services/bodyBuilder/body-builder.service';
import { tourConfig } from 'src/app/explorer/configs/tour';
import { ESHttpError } from 'src/app/explorer/store/actions/actions.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from './representationalComponents/snack/snack.component';
import {
  GeneralConfigs,
  ComponentDashboardConfigs,
} from 'src/app/explorer/configs/generalConfig.interface';
import { ItemsService } from '../services/itemsService/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MainBodyBuilderService } from '../services/mainBodyBuilderService/main-body-builder.service';
import { NotfoundComponent } from 'src/app/components/notfound/notfound.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardConfig: Array<GeneralConfigs> = dashboardConfig;
  countersConfig: Array<GeneralConfigs> = countersConfig;
  tourConfig = tourConfig;
  oldViewState: Map<string, boolean>;

  constructor(
    private readonly store: Store<fromStore.AppState>,
    private readonly bodyBuilderService: BodyBuilderService,
    private readonly mainbodyBuilderService: MainBodyBuilderService,
    private readonly snackBar: MatSnackBar,
    private readonly itemsService: ItemsService,
    private activeRoute: ActivatedRoute,
    private route: Router
  ) {
    this.oldViewState = new Map<string, boolean>();
    [this.countersConfig[0], ...this.dashboardConfig].forEach(
      ({ componentConfigs }: GeneralConfigs) =>
        this.oldViewState.set(
          (componentConfigs as ComponentDashboardConfigs).id,
          false
        )
    );
  }

  async ngOnInit() {

    let shareID = this.activeRoute.snapshot.paramMap.get("id");
    if (shareID) {
      try {
        let shareitem: any = await this.itemsService.getShare(shareID);
        if (shareitem)
          this.bodyBuilderService.setAggAttributes = shareitem.attr;
        else
          this.route.navigate(['notfound'])
      } catch (e) {
        this.route.navigate(['notfound'])
      }
    }
    this.store.dispatch(
      new SetQuery(this.bodyBuilderService.buildMainQuery().build())
    );

    this.store.select(fromStore.getErrors).subscribe((e: ESHttpError) => {
      if (e) {
        this.snackBar.openFromComponent(SnackComponent).instance.error =
          e.error;
      }
    });
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
