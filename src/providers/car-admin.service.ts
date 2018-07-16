import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Car } from '../models/car.model';
import { Observable } from 'rxjs';

@Injectable()
export class CarAdminProvider implements OnInit {
  carCollection: AngularFirestoreCollection<Car>;
  car$: Observable<Car[]>;

  constructor(public afStore: AngularFirestore) {
    this.carCollection = this.afStore.collection('cars', ref => ref.orderBy('createdDate', 'desc'));
    // this.car$ = this.carCollection.valueChanges();
    this.carCollection.snapshotChanges().map(item => {
      return item.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  ngOnInit() {}

  async addCar(car: Car) {
    await this.afStore.collection('cars').add(car);
  }

  getCars() {
    return this.carCollection.snapshotChanges().map(item => {
      return item.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  deleteCar(car: Car) {
    return this.carCollection.doc(`${car.id}`).delete();
  }
}
