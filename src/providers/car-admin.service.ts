import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

// import * as FormData from 'form-data';
import { settings } from '../config/config';
import { Car } from '../models/car.model';

@Injectable()
export class CarAdminProvider implements OnInit {
  carCollection: AngularFirestoreCollection<Car>;
  car$: Observable<Car[]>;

  carSelectedImages: any[];
  private selectedCar: any;
  private editedCarStorageKey: string = 'edited-car';
  private API_URL: string = 'http://192.168.0.102:7777/api/car';

  constructor(
    public afStore: AngularFirestore,
    private http: HttpClient,
    private transfer: FileTransfer,
    private storage: NativeStorage,
    private store: Storage,
    private file: File
  ) {
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
    // await this.afStore.collection('cars').add(car);
    // const token = await this.storage.getItem('token');
    const token = await this.store.get('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const input: FormData = await this.frameBodyParam(car);
    this.http
      .post(this.API_URL, input, {
        headers: headers
      })
      .toPromise();
    // .then(result => console.log(result), error => console.log(error));
  }

  private async frameBodyParam(car): Promise<FormData> {
    // // Destination URL
    // let url = settings.api_root + 'images';

    // // File for Upload
    // var targetPath = url;

    // var options: FileUploadOptions = {
    //   fileKey: 'photos',
    //   chunkedMode: false,
    //   mimeType: 'multipart/form-data',
    //   params: {
    //     make: car.make,
    //     make_year: car.make_year,
    //     model: car.model,
    //     transmission_type: car.transmission_type,
    //     varriant: car.varriant,
    //     kms_driven: car.kms_driven,
    //     number_of_owners: car.number_of_owners,
    //     fuel_type: car.fuel_type,
    //     condition: car.condition,
    //     color: car.color,
    //     vehicle_type: car.vehicle_type,
    //     inspection_valid_until: car.inspection_valid_until,
    //     registrationPlace: car.registrationPlace,
    //     insurance_type: car.insurance_type,
    //     insurance_year: car.insurance_year,
    //     amount: car.amount,
    //     isFixed: car.isFixed,
    //     isExchangeAccepted: car.isExchangeAccepted,
    //     duration: car.duration,
    //     mileage: car.mileage,
    //     description: car.description,
    //     isCarAccidental: car.isCarAccidental,
    //     isCarCertified: car.isCarCertified,
    //     isCarFloodAffected: car.isCarFloodAffected
    //   }
    // };

    // const fileTransfer: FileTransferObject = this.transfer.create();
    // fileTransfer.upload(`${settings.api_root}/car`,);

    let formData = new FormData();
    if (car.photo && car.photo.length > 0) {
      // Array.from(car.photo).map(item => this.readFile(item, formData));
      await Promise.all(
        Array.from(car.photo).map(async imgPath => {
          const data: any = await this.makeFileIntoBlob(imgPath);
          formData.append('photos', data.imgBlob, data.fileName);
        })
      );
    }
    formData.append('make', car.make);
    formData.append('make_year', car.make_year);
    formData.append('model', car.model);
    formData.append('transmission_type', car.transmission_type);
    formData.append('varriant', car.varriant);
    formData.append('kms_driven', car.kms_driven);
    formData.append('number_of_owners', car.number_of_owners);
    formData.append('fuel_type', car.fuel_type);
    formData.append('condition', car.condition);
    formData.append('color', car.color);
    formData.append('vehicle_type', car.vehicle_type);
    formData.append('inspection_valid_until', car.inspection_valid_until);
    formData.append('registrationPlace', car.registrationPlace);
    formData.append('insurance_type', car.insurance_type);
    formData.append('insurance_year', car.insurance_year);
    formData.append('amount', car.amount);
    formData.append('isFixed', car.isFixed);
    formData.append('isExchangeAccepted', car.isExchangeAccepted);
    formData.append('duration', car.duration);
    formData.append('mileage', car.mileage);
    formData.append('description', car.description);
    formData.append('isCarAccidental', car.isCarAccidental);
    formData.append('isCarCertified', car.isCarCertified);
    formData.append('isCarFloodAffected', car.isCarFloodAffected);
    // formData.set('showroomName', car.showroomName);
    // formData.set('address', car.address);
    // formData.set('city', car.city);
    // formData.set('state', car.state);
    // formData.set('contact_no', car.contact_no);
    return formData;
  }

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          console.log(fileEntry);
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));

          fileName = name;

          // we are provided the name, so now read the file into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: 'image/jpeg'
          });

          // pass back blob and the name of the file for saving
          // into mongodb
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  /**
   * To get Blob out of File
   * @param file Selected Image File from Gallery/Camera
   * @param formDataInput Form Data
   */
  // private readFile(file: any, formDataInput: FormData) {
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const imgBlob = new Blob([reader.result], { type: file.type });
  //     formDataInput.append('photos', imgBlob, file.name);
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  async updateCar(id: string, car: any) {
    const carRef: AngularFirestoreDocument<any> = this.afStore.doc(`cars/${id}`);

    return await carRef.set(car, { merge: true });
    // .collection('cars')
    // .doc(id)
    // .update(car);
  }

  async getCars(): Promise<any[]> {
    const token = await this.store.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const cars: any = await this.http.get(this.API_URL, { headers }).toPromise();
    return cars.result;
    // return this.carCollection.snapshotChanges().map(item => {
    //   return item.map(snap => {
    //     const data = snap.payload.doc.data();
    //     const id = snap.payload.doc.id;
    //     return { id, ...data };
    //   });
    // });
  }

  deleteCar(car: Car) {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.delete(`${this.API_URL}/${car.id}`, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
    // return this.carCollection.doc(`${car.id}`).delete();
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
