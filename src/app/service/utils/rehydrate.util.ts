import {
  Action,
  ActionReducer,
  createReducer,
  ActionCreator,
} from '@ngrx/store';
import { StorageService, StorageType } from './storage.service';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';

export function createRehydrateReducer<S, A extends Action = Action>(
  key: string,
  initialState: S,
  ...ons: ReducerTypes<S, ActionCreator[]>[]
): ActionReducer<S, A> {
  // rehydrate
  const newInitialState =
    StorageService.getForKey(key, StorageType.Local) ?? initialState;

  // new reducers save state to localstorage
  const newOns: ReducerTypes<S, ActionCreator[]>[] = [];
  ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
    const newReducer: ActionReducer<S, A> = (
      state: S | undefined,
      action: A
    ) => {
      const newState = oldOn.reducer(state, action);
      StorageService.setForKey(key, newState, StorageType.Local);
      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });
  return createReducer(newInitialState, ...newOns);
}
