import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { Store } from 'src/store';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyDgDF0g_-B8RiHVguMkpCCQVB1_5pRJOU8",
  authDomain: "andaman7-dash.firebaseapp.com",
  databaseURL: "https://andaman7-dash.firebaseio.com",
  projectId: "andaman7-dash",
  storageBucket: "andaman7-dash.appspot.com",
  messagingSenderId: "832698702010",
  appId: "1:832698702010:web:b93cf9c064e065478a8a83"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    CommonModule, 
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    SharedModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Store,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
