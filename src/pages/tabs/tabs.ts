import { Component } from '@angular/core';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'UploadPage';
  tab3Root = 'ContactPage';
  tab4Root = 'DisplayPage';

  constructor() {

  }
}
