import {
  GeneralConfigs,
  searchOptions,
  ComponentLabelConfigs,
  ComponentSearchConfigs,
  ComponentFilterConfigs,
  icons,
} from './generalConfig.interface';

export const filtersConfig: GeneralConfigs[] = [
  {
    show: true,
    component: 'LabelComponent',
    componentConfigs: {
      text: `Create your query by entering choices in one of
        more filters below, click on ICONS:${icons.loop} to clear your query.`,
    } as ComponentLabelConfigs,
  },
  {
    show: true,
    component: 'SearchComponent',
    componentConfigs: {
      placeholder: 'Search for Title, Author, etc',
      type: searchOptions.allSearch,
    } as ComponentSearchConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select author(s)',
      source: 'author.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'LabelComponent',
    componentConfigs: {
      text: 'Year(s)',
    } as ComponentLabelConfigs,
  },
  {
    show: true,
    component: 'RangeComponent',
    componentConfigs: {
      source: 'year.keyword',
      addInMainQuery: false,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SearchComponent',
    componentConfigs: {
      placeholder: 'Title',
      type: searchOptions.titleSearch,
    } as ComponentSearchConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select region(s)',
      source: 'region.keyword',
      addInMainQuery: false,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select country(ies)',
      source: 'country.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select subject(s)',
      source: 'subject.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select language(s)',
      source: 'language.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select Status',
      source: 'status.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select type(s)',
      source: 'type.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'LabelComponent',
    componentConfigs: {
      text: 'Affiliation and Donors',
      border: true,
    } as ComponentLabelConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select CRP(s) and Platforms',
      source: 'crp.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'Select author(s) affiliation(s)',
      source: 'affiliation.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      placeholder: 'select Funder(s)',
      source: 'sponsorship.keyword',
      addInMainQuery: true,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'LabelComponent',
    componentConfigs: {
      text: 'Sources',
      border: true,
      description: `
        Select specific repositories to look up, leave it blank to
        loop up in all available repositories. Select specific
        CGSpace communities and MELSpace collecions to look up,
        leave it blank to look up in all available communities
        and collections.
      `,
    } as ComponentLabelConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      expandPosition: 'top',
      placeholder: 'Select repository(ies)',
      source: 'repo.keyword',
      addInMainQuery: false,
    } as ComponentFilterConfigs,
  },
  {
    show: true,
    component: 'SelectComponent',
    componentConfigs: {
      expandPosition: 'top',
      placeholder: 'Select Community(ies)',
      source: 'communityList.keyword',
      addInMainQuery: false,
    } as ComponentFilterConfigs,
  },
];
