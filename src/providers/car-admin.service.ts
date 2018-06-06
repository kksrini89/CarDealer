import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import { Car } from '../models/car.model';

@Injectable()
export class CarAdminProvider {
  private afDocument: AngularFirestoreDocument<Car>;
  private afCollection: AngularFirestoreCollection<Car>;

  constructor(public http: HttpClient, private afStore: AngularFirestore) {
    console.log('Hello CarAdminProvider Provider');
  }

  addCar(car: Car) {

  }
}
