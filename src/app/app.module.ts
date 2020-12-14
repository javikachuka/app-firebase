import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router'; // importacion para el manejo de rutas
import { SidebarModule } from 'ng-sidebar'; // sidebar instalado con npm (ng-sidebar)
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { ProductComponent } from './product/product.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; // paquete para funcionamiento de modal
import { AngularFireModule } from '@angular/fire'; //firebase
import { environment } from '../environments/environment'; //entorno
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; //manejo de formularios
import { AngularFireAuthModule } from '@angular/fire/auth'; // modulo auth firebase
import { LoginComponent } from './login/login.component'; // modulo auth de firebase
import { AngularFirestoreModule } from '@angular/fire/firestore'; // modulo auth firebase
import { NgxSpinnerModule } from "ngx-spinner"; // spinner
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'users',
    component: UserComponent
  },
  {
    path: 'products',
    component: ProductComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    ProductComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rutas), //config de rutas
    SidebarModule.forRoot(), // config de sidebar
    NgbModule, //importar funcionamiento de modal
    AngularFireModule.initializeApp(environment.firebase), // conexion a firebase
    AngularFireAuthModule, // auth de firebase
    AngularFirestoreModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
