import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase/app';

@Injectable()
export class CommonProvider {
  mobileNumberRegex = /^[0]?[789]d{9}$/;

  constructor(public alertCtrl: AlertController) {}

  /**
   * To check valid data
   * @param data
   */
  getvalid(data) {
    if (data === undefined || data === null || data === '') {
      return false;
    } else {
      return true;
    }
  }

  /**
   * To show alert globally
   * @param title Title
   * @param message Message content
   */
  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  newUploadImage(imageURI, dealerName) {
    try {
      //base64Image
      return new Promise<any>((resolve, reject) => {
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef
          .child('uploads')
          .child('profile-images')
          .child(`${dealerName}`);
        // .child(`${new Date().getTime()}`);
        this.newEncodeImageUri(imageURI, function(image64) {
          imageRef.putString(image64, 'data_url').then(
            snapshot => {
              resolve(snapshot.downloadURL);
            },
            err => {
              reject(err);
            }
          );
        });
      });
    } catch (error) {
      throw error;
    }
  }

  newEncodeImageUri(imageUri, callback) {
    try {
      var c = document.createElement('canvas');
      var ctx = c.getContext('2d');
      var img = new Image();
      img.onload = function() {
        var aux: any = this;
        c.width = aux.width;
        c.height = aux.height;
        ctx.drawImage(img, 0, 0);
        var dataURL = c.toDataURL('image/jpeg');
        callback(dataURL);
      };
      img.src = imageUri;
    } catch (error) {
      throw error;
    }
  }
}
