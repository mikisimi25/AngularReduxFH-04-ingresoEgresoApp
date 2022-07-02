import { NgModule } from '@angular/core';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';


@NgModule({
  declarations: [],
  imports: [
    MessagesModule,
    MessageModule
  ],
  exports: [
    MessagesModule,
    MessageModule
  ]
})
export class PrimengModule { }
