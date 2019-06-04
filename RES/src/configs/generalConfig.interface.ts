export type ComponentConfigs =
  | ComponentDashboardConfigs
  | ComponentCounterConfigs
  | ComponentLabelConfigs
  | ComponentSearchConfigs
  | ComponentFilterConfigs
  | Tour;

export interface Tour {
  id: string;
  description: string;
  title: string;
}

export interface GeneralConfigs {
  show?: boolean;
  tour?: boolean;
  component?: string;
  title?: string;
  componentConfigs: ComponentConfigs;
  class?: string;
  scroll?: Scroll;
}

export interface Scroll {
  icon?: string;
  linkedWith?: ComponentsIdsToScroll;
}

export interface ComponentDashboardConfigs {
  id: string;
  title: string;
  chartType: ChartTypes;
  description: string;
  source: string | Array<string>; // SourceSchema
  content?: PaginatedListConfigs;
}

export interface ComponentCounterConfigs {
  id: string;
  title: string;
  source: string;
  percentageFromTotal: boolean;
  filter?: string;
  description?: string;
}

export interface ComponentLabelConfigs {
  text: string;
  border: boolean;
  description?: string;
}

export interface ComponentSearchConfigs {
  placeholder: string;
  type: searchOptions;
}

export interface ComponentFilterConfigs {
  source: string; // FilterSchema | SourceSchema
  placeholder?: string;
  expandPosition?: 'top' | 'bottom';
}

export interface SortOption {
  display: string;
  value: string;
  sort?: 'desc' | 'asc';
}

/**
 * `tags` are `object with {[key: string]: string}`
 * * tags :
 *    * key => is the label e.g: Subject : <data>
 *    * string => is the value e.g: <label> : 92
 */
export interface PaginatedListConfigs {
  icon: string; // ListSchema
  title: string; // ListSchema
  description: string; // ListSchema
  tags: object; // [string, ListSchema];
  identifierUri: string; // ListSchema
  altmetric: boolean;
  filterOptions: SortOption[];
}

export enum searchOptions {
  titleSearch,
  allSearch
}

export enum ComponentsIdsToScroll {
  counters = 'counters',
  pie = 'pie',
  wordcloud = 'wordcloud',
  map = 'map',
  bar = 'bar',
  mapTop = 'mapTop',
  topLists = 'topLists',
  topAffiliations = 'topAffiliations',
  CRP = 'CRP',
  funders = 'funders',
  paginatedList = 'paginatedList',
  lineChart = 'lineChart',
  SimiCircle = 'SimiCircle'
}

export enum icons {
  export = 'view_headline',
  arrowUp = 'expand_less',
  pdf = 'picture_as_pdf',
  xls = 'view_array',
  word = 'dock',
  loop = 'loop'
}

export enum ChartTypes {
  pie = 'pie',
  wordcloud = 'wordcloud',
  map = 'map',
  bar = 'bar',
  line = 'line',
  spline = 'spline'
}
