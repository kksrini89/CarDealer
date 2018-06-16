import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class CommonProvider {
  constructor(public alertCtrl: AlertController) {}

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
