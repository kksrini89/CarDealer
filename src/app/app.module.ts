import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';

// import { HomePage } from '../pages/home/home';
// import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CarAdminProvider } from '../providers/car-admin.service';
import { ComponentsModule } from '../components/components.module';
import { CommonProvider } from '../providers/common.service';
// import { AuthProvider } from '../providers/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBsiZPo-nKIM_dXaFCL840TPgKZckbwa2I',
  authDomain: 'cardealer-e8f8a.firebaseapp.com',
  databaseURL: 'https://cardealer-e8f8a.firebaseio.com',
  projectId: 'cardealer-e8f8a',
  storageBucket: 'cardealer-e8f8a.appspot.com',
  messagingSenderId: '698468554914'
};

// const prodFirebaseConfig = {
//   apiKey: 'AIzaSyAo4OBVMuJuYXGOvGWSdNS2NZGgPvtKfLk',
//   authDomain: 'own-carseller-prod.firebaseapp.com',
//   databaseURL: 'https://own-carseller-prod.firebaseio.com',
//   projectId: 'own-carseller-prod',
//   storageBucket: 'own-carseller-prod.appspot.com',
//   messagingSenderId: '728792676162'
// };

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    GooglePlus,
    CarAdminProvider,
    CommonProvider
  ]
})
export class AppModule {}
