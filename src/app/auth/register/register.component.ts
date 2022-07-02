import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  public registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required ],
      email: ['', Validators.required, Validators.email ],
      password: ['', Validators.required ],
    })
  }

  public crearUsuario() {
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    if( this.registroForm.invalid ) { return; }

    const { nombre, email, password } = this.registroForm.value;

    this.authService.crearUsuario( nombre, email, password )
      .then( credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/'])
      })
      .catch( err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      })
  }

}
