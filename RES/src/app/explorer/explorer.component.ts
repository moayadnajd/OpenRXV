import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import * as fromStore from './store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MainBodyBuilderService } from 'src/app/explorer/services/mainBodyBuilderService/main-body-builder.service';
import { TourService, IStepOption } from 'ngx-tour-md-menu';
import { countersConfig } from 'src/app/explorer/configs/counters';
import {
  GeneralConfigs,
  ComponentCounterConfigs,
  ComponentDashboardConfigs,
  Tour,
} from 'src/app/explorer/configs/generalConfig.interface';
import { dashboardConfig } from 'src/app/explorer/configs/dashboard';
import { tourConfig } from 'src/app/explorer/configs/tour';
import { orAndToolTip } from 'src/app/explorer/configs/tooltips';
import { ScreenSizeService } from 'src/app/explorer/services/screenSize/screen-size.service';
import { ItemsService } from './services/itemsService/items.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'explorer-root',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  @ViewChild('drawer') sidenav: MatDrawer;
  loading$: Observable<boolean>;
  render: boolean;
  shareID: string
  orOperator: boolean;
  readonly orAndToolTip: string;
  private prevenetMouseOnNav: boolean;
  options: any = {
    bottom: 0,
    fixed: true,
    top: 0,
  };
  share() {

    console.log(this.itemsService.saveShare(this.mainBodyBuilderService.getAggAttributes));


  }
  get isSmall(): boolean {
    return this.screenSizeService.isSmallScreen;
  }

  constructor(
    private readonly store: Store<fromStore.AppState>,
    private readonly mainBodyBuilderService: MainBodyBuilderService,
    private readonly tourService: TourService,
    private readonly screenSizeService: ScreenSizeService,
    private readonly itemsService: ItemsService,
  ) {
    this.orOperator = false;
    this.orAndToolTip = orAndToolTip;
    this.options = {
      bottom: 0,
      fixed: true,
      top: 0,
    };
  }

  async ngOnInit() {
    this.loading$ = this.store.select(fromStore.getLoadingStatus);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.prevenetMouseOnNav) {
      if (event.x === 0 && !this.sidenav.opened) {
        this.openAndRender('over');
      }
      if (event.x > this.sidenav._width && this.sidenav.opened) {
        this.sidenav.close();
      }
    }
  }

  openNavAndDisableIgnoreMouseEvent(): void {
    this.openAndRender('side');
    this.prevenetMouseOnNav = true;
    this.sidenav.closedStart.subscribe(() => (this.prevenetMouseOnNav = false));
  }

  addRemoveOrOperator(): void {
    this.orOperator = !this.orOperator;
    this.mainBodyBuilderService.setOrOperator = this.orOperator;
  }

  refresh(): void {
    window.location.reload();
  }

  startTour(): void {
    this.tourService.initialize(this.mapConfigsToTour());
    this.tourService.start();
  }

  private openAndRender(mode: 'over' | 'push' | 'side'): void {
    this.sidenav.mode = this.isSmall ? 'over' : mode;
    this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
    this.renderSideNav();
  }

  private mapConfigsToTour(): IStepOption[] {
    return [...tourConfig, ...countersConfig, ...dashboardConfig]
      .filter(({ show }: GeneralConfigs) => show)
      .map(({ componentConfigs, tour }: GeneralConfigs) => {
        const { description, title, id } = componentConfigs as
          | ComponentCounterConfigs
          | ComponentDashboardConfigs
          | Tour;
        return (
          tour &&
          this.checkIfApplicableForTour(id, description, title) &&
          ({
            anchorId: id,
            content: description,
            title,
            enableBackdrop: true,
          } as IStepOption)
        );
      })
      .filter((iso: IStepOption) => Object.keys(iso).length >= 1);
  }

  private checkIfApplicableForTour(
    id: string,
    content: string,
    title: string
  ): boolean {
    return !!(id && content && title);
  }

  private renderSideNav(): void {
    if (this.render === undefined) {
      this.render = true;
    }
  }
}
