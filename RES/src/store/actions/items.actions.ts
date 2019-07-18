import { Action } from '@ngrx/store';
import {
  ElasticsearchResponse,
  ElasticsearchQuery,
} from 'src/app/filters/services/interfaces';
import { InView, ESHttpError } from './actions.interfaces';

export enum ActionTypes {
  getData = '[items] GetData',
  getDataSuccess = '[items] GetDataSuccess',
  getDataError = '[items] GetDataError',
  SetCounters = '[items] SetCounters',
  GetCounters = '[items] GetCounters',
  SetInView = '[items] SetInView',
}

export class GetData implements Action {
  readonly type = ActionTypes.getData;
  constructor(public payload: ElasticsearchQuery = null) {}
}

export class GetDataSuccess implements Action {
  readonly type = ActionTypes.getDataSuccess;
  constructor(
    public payload: ElasticsearchResponse = null,
    public addHits: boolean = true
  ) {}
}

export class GetDataError implements Action {
  readonly type = ActionTypes.getDataError;
  constructor(public payload: ESHttpError = null) {}
}

export class SetCounters implements Action {
  readonly type = ActionTypes.SetCounters;
  constructor(public payload = null) {}
}

export class GetCounters implements Action {
  readonly type = ActionTypes.GetCounters;
  constructor(public payload = null) {}
}

export class SetInView implements Action {
  readonly type = ActionTypes.SetInView;
  constructor(public payload: InView = null) {}
}

export type itemsActions =
  | GetData
  | GetDataError
  | GetDataSuccess
  | SetCounters
  | GetCounters
  | SetInView;
