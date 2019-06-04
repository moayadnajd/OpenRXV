import {
  GeneralConfigs,
  ComponentDashboardConfigs,
  ComponentsIdsToScroll,
  icons,
  ChartTypes
} from './generalConfig.interface';
import { SourceSchema, ListSchema } from './schema';

/**
 * * componentConfigs.source determine where
 * * this component will get it's data from the store
 * * `search for getBuckets in the Store`
 * * IF you want to change the chart type
 *    * change the type
 * * IF you want to add new component add an id to it
 *    * in the `ComponentsIdsToScroll`
 */

export const dashboardConfig: GeneralConfigs[] = [
  {
    show: false,
    class: 'col-md-3 no-side-padding',
    component: 'SimiCircleComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.SimiCircle,
      title: 'Info Products by Type',
      source: SourceSchema.status,
      chartType: ChartTypes.pie,
      description: `
          All the available :${
            icons.export
          } to export this graphic, click on ICONS:${
        icons.arrowUp
      } to collapse it.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      linkedWith: ComponentsIdsToScroll.topLists
    },
    tour: true
  },
  {
    show: false,
    class: 'col-md-9 no-side-padding',
    component: 'LineComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.lineChart,
      title: 'Info Products by Type',
      source: SourceSchema.status,
      chartType: ChartTypes.line,
      description: `
          All the available :${
            icons.export
          } to export this graphic, click on ICONS:${
        icons.arrowUp
      } to collapse it.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      linkedWith: ComponentsIdsToScroll.topLists
    },
    tour: true
  },
  {
    show: true,
    class: 'col-md-6 no-side-padding',
    component: 'PieComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.pie,
      title: 'Info Products by Type',
      source: SourceSchema.type,
      description: `
          All the available information products are represented here and disaggregated by Type.
          You can toggle on/off individual type of visualization in the list at the right side of
          the graphic. Click on ICONS:${
            icons.export
          } to export this graphic, click on ICONS:${
        icons.arrowUp
      } to collapse it.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      icon: 'pie_chart'
    },
    tour: true
  },
  {
    class: 'col-md-6 no-side-padding',
    show: true,
    component: 'WordcloudComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.wordcloud,
      title: 'Info Products by Subject',
      source: SourceSchema.subject,
      chartType: ChartTypes.wordcloud,
      description: `
          Top Subjects tags for all the information products are represented here, the greater the word,
          the higher the number of information. Products tagged to that specific Subject. Click on ICONS:${
            icons.export
          }
          to export this graphic, click on ICONS:${
            icons.arrowUp
          } to collapse it.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      linkedWith: ComponentsIdsToScroll.pie
    },
    tour: true
  },
  {
    show: true,
    class: 'col-md-9 mt-3 no-side-padding',
    component: 'MapComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.map,
      source: SourceSchema.country,
      title: 'Info Products Overview',
      chartType: ChartTypes.map,
      description: `
          Geographic tags for all the information products found are represented here and disaggregated by
          country. The darker the color the higher the number of information products tagged to that specific
          country. Overall, the graphic shows the world areas targeted by research activities that produced
          information products. Click on ICONS:${icons.export}
          to export this graphic, click on ICONS:${icons.arrowUp}
          to collapse it.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      icon: 'map'
    },
    tour: true
  },
  {
    class: 'col-md-3 mt-3 no-side-padding shorter',
    show: true,
    component: 'ListComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.mapTop,
      title: 'Top Countries',
      source: SourceSchema.country,
      description: `
          The top Countries by number of information products.
          Click on ICONS:${icons.arrowUp} to collapse the list.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      linkedWith: ComponentsIdsToScroll.map
    },
    tour: true
  },
  {
    show: true,
    class: 'col-md-12 mt-3 no-side-padding',
    component: 'BarComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.bar,
      source: SourceSchema.country,
      title: 'Info Products Analytics',
      chartType: ChartTypes.bar,
      description: `
            All Information Products are represented here and can be further disaggregated by two variables at the same time
            choosing from “Type", "Year", "Author", "CRP" and "Funder". The "Year" pre-selects the five most recent years. The
            other filters automatically pre-select those options that have the most results, helping you to access your
            information faster. Click on ICONS:${icons.export} to export
            this graphic, click on ICONS:${icons.arrowUp} to collapse it.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      icon: 'bar_chart'
    },
    tour: true
  },
  {
    class: 'col-md-6 mt-3 no-side-padding',
    show: true,
    component: 'ListComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.topLists,
      title: 'Top Contributors',
      source: SourceSchema.author,
      description: `
          The top twenty Authors by number of information products.
          Click on ICONS:${icons.arrowUp} to collapse the list.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      icon: 'list_alt'
    },
    tour: true
  },
  {
    class: 'col-md-6 mt-3 no-side-padding',
    show: true,
    component: 'ListComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.topAffiliations,
      title: 'Top Affiliations',
      source: SourceSchema.affiliation,
      description: `
          Top twenty affiliations by number of information products.
          Click on ICONS:${icons.arrowUp} to collapse the list.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      linkedWith: ComponentsIdsToScroll.topLists
    },
    tour: true
  },
  {
    class: 'col-md-6 mt-3 no-side-padding',
    show: true,
    component: 'ListComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.CRP,
      title: 'CRPs and Platforms',
      source: SourceSchema.crp,
      description: `
          All CRPs and platforms tagged across all information products
          are represented here and ordered by quantity of tags for
          each CRP or platform. Scroll down to see more results.
          Click on ICONS:${icons.arrowUp} to collapse the list.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      icon: 'star_rate'
    },
    tour: true
  },
  {
    class: 'col-md-6 mt-3 no-side-padding',
    show: true,
    component: 'ListComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.funders,
      title: 'Funders',
      source: SourceSchema.sponsorship,
      description: `
          All funders tagged across all information products are represented here and
          orderd by quantity of tags for each funder. Scroll down to see more results.
          Click on ICONS:${icons.arrowUp} to collapse the list.
      `
    } as ComponentDashboardConfigs,
    scroll: {
      linkedWith: ComponentsIdsToScroll.CRP
    },
    tour: true
  },
  {
    class: 'col-md-12 mt-3 no-side-padding',
    show: true,
    component: 'ListComponent',
    componentConfigs: {
      id: ComponentsIdsToScroll.paginatedList,
      title: 'Info Producs List of Results',
      description: `
          All information products found are represented here, You can sort this list by "Date",
          "Type", "Authors", "Altmetric: Attention Score" and "Views & Downloads" info.
          Click on ICONS:${icons.arrowUp} to collapse the list.
      `,
      content: {
        title: ListSchema.title,
        icon: ListSchema.icon,
        identifierUri: ListSchema.identifierUri,
        altmetric: true,
        description: ListSchema.description,
        tags: {
          Publisher: ListSchema.publisher,
          Subject: ListSchema.subject,
          Type: ListSchema.type,
          Status: ListSchema.status,
          'Date issued': ListSchema.date,
          'Reporting CRP(s) and Platform(s)': ListSchema.crp,
          'Attention Score': ListSchema.altmetric,
          numbers: ListSchema.numbers
        },
        filterOptions: [
          { display: 'Date', value: 'date', sort: 'desc' },
          { display: 'Type', value: 'type.keyword', sort: 'desc' },
          {
            display: 'Authors',
            value: 'citation.keyword',
            sort: 'desc'
          },
          {
            display: 'Altmetric: Attention Score',
            value: 'altmetric.score',
            sort: 'desc'
          },
          { display: 'Views & Downloads', value: 'numbers.score', sort: 'desc' }
        ]
      }
    } as ComponentDashboardConfigs,
    scroll: {
      icon: 'view_list'
    },
    tour: true
  }
];
