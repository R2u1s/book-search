import { MY_API_KEY } from "../../constants/api";
import { AppDispatch, TBookInfo } from "../../types/types";
import { request } from "../../utils/utils";
import { PAGINATION_QTY } from "../../constants/api";
import { FilterStates } from "../../types/enums";

export const FIRST_SEARCH_REQUEST: 'FIRST_SEARCH_REQUEST' = 'FIRST_SEARCH_REQUEST';
export const FIRST_SEARCH_SUCCESS: 'FIRST_SEARCH_SUCCESS' = 'FIRST_SEARCH_SUCCESS';
export const FIRST_SEARCH_FAILED: 'FIRST_SEARCH_FAILED' = 'FIRST_SEARCH_FAILED';

export const NEXT_SEARCH_REQUEST: 'NEXT_SEARCH_REQUEST' = 'NEXT_SEARCH_REQUEST';
export const NEXT_SEARCH_SUCCESS: 'NEXT_SEARCH_SUCCESS' = 'NEXT_SEARCH_SUCCESS';
export const NEXT_SEARCH_FAILED: 'NEXT_SEARCH_FAILED' = 'NEXT_SEARCH_FAILED';

export const WRITE_BOOKINFO: 'WRITE_BOOKINFO' = 'WRITE_BOOKINFO';
export const CLEAR_BOOKINFO: 'CLEAR_BOOKINFO' = 'CLEAR_BOOKINFO';

export const CLEAR_STORE: 'CLEAR_STORE' = 'CLEAR_STORE';

export type TBooksActions =
  | IFirstSearchErrorAction
  | IFirstSearchRequestAction
  | IFirstSearchSuccessAction
  | INextSearchErrorAction
  | INextSearchRequestAction
  | INextSearchSuccessAction
  | IWriteBookInfoAction
  | IClearBookInfoAction
  | IClearStoreAction

export interface IFirstSearchRequestAction { readonly type: typeof FIRST_SEARCH_REQUEST }
export interface IFirstSearchSuccessAction {
  readonly type: typeof FIRST_SEARCH_SUCCESS,
  readonly data: {
    items: Object[],
    totalItems: number,

    firstSearchFailed: boolean,
    firstSearchRequest: boolean
  },
  readonly text: string
}
export interface IFirstSearchErrorAction { readonly type: typeof FIRST_SEARCH_FAILED }

export interface INextSearchRequestAction { readonly type: typeof NEXT_SEARCH_REQUEST }
export interface INextSearchSuccessAction {
  readonly type: typeof NEXT_SEARCH_SUCCESS,
  readonly data: {
    items: Object[],
    totalItems: number,

    nextSearchFailed: boolean,
    nextSearchRequest: boolean
  }
}
export interface INextSearchErrorAction { readonly type: typeof NEXT_SEARCH_FAILED }

export interface IWriteBookInfoAction {
  readonly type: typeof WRITE_BOOKINFO,
  readonly currentBook: TBookInfo
}
export interface IClearBookInfoAction { readonly type: typeof CLEAR_BOOKINFO }

export interface IClearStoreAction { readonly type: typeof CLEAR_STORE }

export const firstSearch = (value: string, orderBy: string, filter: string) => { //первый запрос к серверу. Загружаем в хранилище первые книги
  return function (dispatch: AppDispatch) {
    dispatch({
      type: FIRST_SEARCH_REQUEST
    });

    let filterValue = '';
    if (filter !== FilterStates.Default) filterValue = `+subject:${filter}` //если запрашивается фильтр по дфеолтному значению, то вместо него пустую строку вставляем

    request(`${value}${filterValue}&orderBy=${orderBy}&startIndex=0&maxResults=${PAGINATION_QTY}&key=${MY_API_KEY}`)
      .then(res => {
        if (res && res.success) {
          const filteredResult =
            dispatch({
              type: FIRST_SEARCH_SUCCESS,
              data: res,
              text: value
            });
        } else {
          dispatch({
            type: FIRST_SEARCH_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: FIRST_SEARCH_FAILED
        });
        console.log(error);
      });
  };
}

//последующие запросы к серверу с пагинацией. Добавляем новые книги к существующим
export const nextSearch = (value: string, orderBy: string, filter: string, startIndex: number, qty: number) => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: NEXT_SEARCH_REQUEST
    });

    let filterValue = '';
    if (filter !== FilterStates.Default) filterValue = `+subject:${filter}` //если запрашивается фильтр по дфеолтному значению, то вместо него пустую строку вставляем

    request(`${value}${filterValue}&key=${MY_API_KEY}&startIndex=${startIndex}&maxResults=${qty}&orderBy=${orderBy}`)
      .then(res => {
        if (res && res.success) {
          dispatch({
            type: NEXT_SEARCH_SUCCESS,
            data: res
          });
        } else {
          dispatch({
            type: NEXT_SEARCH_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: NEXT_SEARCH_FAILED
        });
        console.log(error);
      });
  };
}

//записываем инфо о просматриваемой книге в хранилище
export const writeBookInfo = (book:TBookInfo) => ({
  type: WRITE_BOOKINFO,
  currentBook: book
});
//очищаем инфо о просматриваемой книге в хранилище
export const clearBookInfo = () => ({
  type: CLEAR_BOOKINFO
});
//очищаем хранилище
export const clearStore = () => ({
  type: CLEAR_STORE,
});
