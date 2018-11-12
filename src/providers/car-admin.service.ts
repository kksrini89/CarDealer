import { Injectable, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import { Car } from '../models/car.model';
import { Observable } from 'rxjs';

@Injectable()
export class CarAdminProvider implements OnInit {
  carCollection: AngularFirestoreCollection<Car>;
  car$: Observable<Car[]>;

  carSelectedImages: any[];
  private selectedCar: any;
  private editedCarStorageKey: string = 'edited-car';

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
    this.carSelectedImages = [];
    this.selectedCar = {};
  }

  ngOnInit() {}

  async addCar(car: any) {
    await this.afStore.collection('cars').add(car);
  }

  async updateCar(id: string, car: any) {
    const carRef: AngularFirestoreDocument<any> = this.afStore.doc(`cars/${id}`);

    return await carRef.set(car, { merge: true });
    // .collection('cars')
    // .doc(id)
    // .update(car);
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

  getSelectedCar(): any {
    return this.selectedCar;
  }

  setSelectedCar(carItem: any): void {
    this.selectedCar = carItem;
  }

  getEditedCarStorageKey(): string {
    return this.editedCarStorageKey;
  }
}
