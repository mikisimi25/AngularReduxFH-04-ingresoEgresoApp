import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2'
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as uiActions from './../shared/ui.actions'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public ingresoForm!  : FormGroup;
  private _loadingSubs!: Subscription;
  public tipo          : string   = 'ingreso';
  public cargando      : boolean  = false;

  constructor(
    private fb                  : FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store               : Store<AppState>
  ) { }

  ngOnInit(): void {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this._loadingSubs = this.store.select('ui').subscribe( ({isLoading}) => this.cargando = isLoading)
  }

  ngOnDestroy(): void {
    this._loadingSubs.unsubscribe();
  }

  public guardar() {

    if( this.ingresoForm.invalid ) { return; }

    console.log(this.ingresoForm.value);
    console.log(this.tipo);

    this.store.dispatch( uiActions.isLoading() )

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo )

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( () => {
        this.ingresoForm.reset()
        this.store.dispatch( uiActions.stopLoading() )
        Swal.fire('Registro creado',descripcion, 'success')
      })
      .catch( err => {
        this.store.dispatch( uiActions.stopLoading() )
        Swal.fire('Error', err.message , 'error')
      } )
  }

}
