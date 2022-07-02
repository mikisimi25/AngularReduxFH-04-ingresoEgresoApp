import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2'

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registroForm!: FormGroup;
  public cargando: boolean = false;
  private _uiSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required ],
      email: ['', Validators.required, Validators.email ],
      password: ['', Validators.required ],
    })

    this._uiSubscription = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading )
  }

  ngOnDestroy(): void {
    this._uiSubscription?.unsubscribe();
  }

  public crearUsuario() {
    if( this.registroForm.invalid ) { return; }

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    this.store.dispatch( ui.isLoading() )

    const { nombre, email, password } = this.registroForm.value;

    this.authService.crearUsuario( nombre, email, password )
      .then( credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading() )
        this.router.navigate(['/'])
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() )
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      })
  }

}
