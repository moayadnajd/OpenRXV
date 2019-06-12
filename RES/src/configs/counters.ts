import {
  GeneralConfigs,
  ComponentCounterConfigs,
} from './generalConfig.interface';

export const countersConfig: GeneralConfigs[] = [
  {
    show: true,
    componentConfigs: {
      id: 'counters',
      title: 'Total Items',
      source: 'total',
      description: `
        Total number of information product found
      `,
      percentageFromTotal: false,
    } as ComponentCounterConfigs,
    scroll: {
      icon: 'dashboard',
    },
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'openAccess',
      title: 'Open Access',
      source: 'status.keyword',
      filter: 'Open Access',
      description: `
        Total number of information products freely
        accessible and usable as by license applied.
      `,
      percentageFromTotal: true,
    } as ComponentCounterConfigs,
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'limitedAcess',
      title: 'Limited Access',
      source: 'status.keyword',
      filter: 'Limited Access',
      description: `
        Total number of information products only
        accesible as by publisher's specifications.
      `,
      percentageFromTotal: true,
    } as ComponentCounterConfigs,
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'languages',
      title: 'Languages',
      source: 'language.keyword',
      description: `
        Total number of information products only accessible
        as by publisher's specifications.
      `,
      percentageFromTotal: false,
    } as ComponentCounterConfigs,
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'authors',
      title: 'Authors',
      source: 'author.keyword',
      description: `
        Total number of Authors involved with he information
        product found
      `,
      percentageFromTotal: false,
    } as ComponentCounterConfigs,
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'authorsAffiliations',
      title: 'Authors Affiliations',
      source: 'affiliation.keyword',
      description: `
        Total number of information products only accessible
        as by Subject's specifications.
      `,
      percentageFromTotal: false,
    } as ComponentCounterConfigs,
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'CRPs&Platforms',
      title: 'CRPs & Platforms',
      source: 'crp.keyword',
      description: `
        Total number of Authors involved with he information
        product found
      `,
      percentageFromTotal: false,
    } as ComponentCounterConfigs,
    tour: true,
  },
  {
    show: true,
    componentConfigs: {
      id: 'countries',
      title: 'Countries',
      source: 'country.keyword',
      description: `
        Total number of information products only accessible
        as by rights specifications.
      `,
      percentageFromTotal: false,
    } as ComponentCounterConfigs,
    tour: true,
  },
];
