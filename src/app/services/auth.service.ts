import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userSubsucription?: Subscription;

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  public initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log( fuser );
      console.log( fuser?.uid );
      console.log( fuser?.email );

      if( fuser ) {

        this.userSubsucription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
            const user = Usuario.fromFirebase( firestoreUser )

            this.store.dispatch( authActions.setUser({ user }) )
          })

      } else {
        this.userSubsucription?.unsubscribe();
        this.store.dispatch( authActions.unSetUser() )
      }


    })
  }

  public crearUsuario( nombre: string, email: string, password: string ){
    return this.auth.createUserWithEmailAndPassword( email, password )
      .then( ({ user }) => {

        const newUser = new Usuario( user!.uid, nombre, email );

        return this.firestore.doc(`${ user?.uid }/usuario`)
          .set({...newUser})
      })
  }

  public loginUsuario( email: string, password: string) {
    return this.auth.signInWithEmailAndPassword( email, password)
  }

  public logout() {
    return this.auth.signOut();
  }

  public isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null)
    )
  }
}
