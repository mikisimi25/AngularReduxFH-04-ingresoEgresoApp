import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '04-ingresoEgresoApp';

  constructor(
    private authService: AuthService,
  ) {
    this.authService.initAuthListener();
  }
}
