import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginacComponent } from './loginac/loginac.component';
import { DataService } from './user/data.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginacComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut : 5000
    })
  ],
  providers: [{
    provide : HTTP_INTERCEPTORS,
    useClass : DataService,
    multi : true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
