import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _userSubs?: Subscription;
  private _ingresosSubs?: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {

    this._userSubs = this.store.select('auth')
    .pipe(
      filter( ({ user }) => user != null)
    )
    .subscribe( ({user}) => {
      console.log(user);

      this._ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener( user?.uid! )
        .subscribe( ingresosEgresosFB => {

          this.store.dispatch( ingresoEgresoActions.setItems({ items: ingresosEgresosFB }) )

        })
    })

  }

  ngOnDestroy(): void {
    this._ingresosSubs?.unsubscribe();
    this._userSubs?.unsubscribe();
  }

}
