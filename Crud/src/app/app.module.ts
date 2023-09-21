import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component'; 
import { AppRoutingModule } from './app-routing.module';
import { ModalComponent } from './employee/modal/modal.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedComponent } from './shared/conformModal.component';
import { LoginComponent } from './login/login.component';
import { TestInterceptor } from './interceptor/test.interceptor';
import { UserComponent } from './user/user.component';
import { UserModalComponent } from './user/user-modal/user-modal.component';
import { enableRipple } from '@syncfusion/ej2-base';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
enableRipple(true);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EmployeeComponent,
    ModalComponent,
    SharedComponent,
    LoginComponent,
    UserComponent,
    UserModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
  
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass:TestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
