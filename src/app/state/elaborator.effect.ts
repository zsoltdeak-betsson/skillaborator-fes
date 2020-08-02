import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ElaboratorAction } from "./elaborator.action";

@Injectable()
export class ElaboratorEffect {

    loadMovies$ = createEffect(() => this.actions$.pipe(
        ofType(ElaboratorAction.getQuestion),
        // TODO
    ));

    constructor(
        private actions$: Actions
    ) { }
}
