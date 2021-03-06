import { Action, On, ActionReducer, createReducer } from '@ngrx/store';
import { StorageService, StorageType } from './storage.service';

export function createRehydrateReducer<S, A extends Action = Action>(
  key: string,
  initialState: S,
  ...ons: On<S>[]
): ActionReducer<S, A> {
  // rehydrate
  const newInitialState =
    StorageService.getForKey(key, StorageType.Local) ?? initialState;

  // new reducers save state to localstorage
  const newOns: On<S>[] = [];
  ons.forEach((oldOn: On<S>) => {
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
