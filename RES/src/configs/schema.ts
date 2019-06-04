/**
 * ! I won't put each bucket key in the same enum,
 * ! because this will make the query bigger,
 * ? for example :
 * ! `SourceSchema` is used in `aggrigations` in the
 * ! main query when the pages loaded.
 * ! But the Filter Schema is used only on demand
 */

/**
 * * this is the `source` used in the
 *    * Dashboard components.
 *    * Most the filters.
 *    * All counters.
 * * They are used to build the main query.
 * * And each component will get its data
 *   from the store based on this values.
 */
export const SourceSchema = {
  type: 'type',
  status: 'status',
  language: 'language',
  author: 'author',
  crp: 'crp',
  country: 'country',
  subject: 'subject',
  affiliation: 'affiliation',
  sponsorship: 'sponsorship'
};

/**
 * * these are 'key' bucket that some of the filters
 * * uses, but most of them uses `SourceSchema`
 */
export const FilterSchema = {
  year: 'year',
  repo: 'repo',
  region: 'region',
  isijournal: 'cg_isijournal',
  communityList: 'community'
};

/**
 * * these are 'key' bucket that the paginated list
 * * used to extract data from the store
 * * and added to the query as `_source`
 * * 'title' is used in the `Title` (second search)
 */
export const ListSchema = {
  title: 'title',
  icon: 'repo',
  identifierUri: 'uri',
  description: 'citation',
  publisher: 'publisher',
  date: 'date',
  altmetric: 'altmetric',
  numbers: 'numbers',
  subject: SourceSchema.subject,
  type: SourceSchema.type,
  status: SourceSchema.status,
  crp: SourceSchema.crp,
  bitstreams: 'bitstreams', // needed for the images
  handle: 'handle', // needed for the altmetric
  thumbnail: 'thumbnail'
};
