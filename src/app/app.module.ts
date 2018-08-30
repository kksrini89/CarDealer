import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { ImagePicker } from '@ionic-native/image-picker';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

// import { HomePage } from '../pages/home/home';
// import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CarAdminProvider } from '../providers/car-admin.service';
import { ComponentsModule } from '../components/components.module';
import { CommonProvider } from '../providers/common.service';
import { SignupPage } from '../pages/signup/signup';
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
  declarations: [MyApp, SignupPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, SignupPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    Network,
    GooglePlus,
    ImagePicker,
    NativeStorage,
    CarAdminProvider,
    CommonProvider
  ]
})
export class AppModule {}
