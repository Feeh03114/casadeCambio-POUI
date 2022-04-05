import { AsyncPipe, registerLocaleData } from '@angular/common';
import ptBr from "@angular/common/locales/pt";
import {
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID, NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

registerLocaleData(ptBr);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    SharedModule,
    RouterModule.forRoot([]),
    PoTemplatesModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: DEFAULT_CURRENCY_CODE, useValue: "BRL" },
    AsyncPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
