import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import * as fromStore from './store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MainBodyBuilderService } from 'src/app/explorer/services/mainBodyBuilderService/main-body-builder.service';
import { TourService, IStepOption } from 'ngx-tour-md-menu';
import {
  GeneralConfigs,
  ComponentCounterConfigs,
  ComponentDashboardConfigs,
  Tour,
} from 'src/app/explorer/configs/generalConfig.interface';
import { orAndToolTip } from 'src/app/explorer/configs/tooltips';
import { ScreenSizeService } from 'src/app/explorer/services/screenSize/screen-size.service';
import { ItemsService } from './services/itemsService/items.service';
import { ShareComponent } from './share/share.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { InViewState } from './store/reducers/items.reducer';
import { SetQuery } from './store';
import { Router } from "@angular/router";

@Component({
  selector: 'explorer-root',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  @ViewChild('drawer') sidenav: MatDrawer;
  loading$: Observable<boolean>;
  render: boolean;
  shareID: string;
  logo: string;
  website_name: string;
  orOperator: boolean;
  primaryColorPalette
  primaryColor
  countersConfig = []
  dashboardConfig = []
  tourConfig = []
  currenRoute: any;
  currentUrl: string;
  readonly orAndToolTip: string;
  private prevenetMouseOnNav: boolean;
  options: any = {
    bottom: 0,
    fixed: true,
    top: 0,
  };
  async share() {
    this.openDialog(this.currentUrl + await this.itemsService.saveShare(this.mainBodyBuilderService.getAggAttributes));
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
    public dialog: MatDialog,
    private readonly currentRouter: Router
  ) {
    this.orOperator = false;
    this.orAndToolTip = orAndToolTip;
    this.options = {
      bottom: 0,
      fixed: true,
      top: 0,
    };
  }

  openDialog(link): void {
    const dialogRef = this.dialog.open(ShareComponent, {
      width: '600px',
      data: { link }
    });
  }




  async ngOnInit() {
    let { counters, dashboard, appearance, welcome } = await JSON.parse(localStorage.getItem('configs'));
    if (appearance.logo)
      this.logo = environment.api + '/' + appearance.logo;
    this.website_name = appearance.website_name;

    this.currenRoute = Object.getOwnPropertyDescriptors(this.currentRouter)
    this.currentUrl = this.currenRoute.location.value._platformLocation.location.href
    this.currentUrl = this.currentUrl.slice(0, this.currentUrl.length - 1)

    let inview = (() => {
      // creating the state dynamically
      const obj = Object.create(null);
      Object.values([counters[0], ...dashboard.flat(1)]).forEach(
        ({ componentConfigs }: GeneralConfigs) =>
          (obj[(componentConfigs as ComponentDashboardConfigs).id] = {
            collapsed: false,
            userSeesMe: false
          })
      );
      return obj;
    })() as InViewState
    Object.keys(inview).forEach(id => {
      this.store.dispatch(
        new fromStore.SetInView({
          id,
          viewState: inview[id]
        })
      );
    });

    this.countersConfig = counters;
    this.dashboardConfig = dashboard.flat(1);
    this.tourConfig = [welcome];
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
    this.openAndRender('over');
    this.prevenetMouseOnNav = true;
    this.sidenav.closedStart.subscribe(() => (this.prevenetMouseOnNav = false));
  }

  addRemoveOrOperator(): void {
    this.orOperator = !this.orOperator;
    this.mainBodyBuilderService.setOrOperator = this.orOperator;
  }

  refresh(): void {
    this.mainBodyBuilderService.resetAttributes()
    setTimeout(() => {

      this.store.dispatch(
        new SetQuery(this.mainBodyBuilderService.buildMainQuery(0).build())
      );
    }, 300);

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

    return [...this.tourConfig, ...this.countersConfig, ...this.dashboardConfig]
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
