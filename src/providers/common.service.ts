import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class CommonProvider {
  mobileNumberRegex = /^[0]?[789]d{9}$/;

  constructor(public alertCtrl: AlertController) { }

  /**
   * To check valid data
   * @param data
   */
  getvalid(data) {
    if (data === undefined || data === null || data === '') {
      return false;
    } else {
      return true;
    };
  };

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
}
