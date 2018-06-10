import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'price-info',
  templateUrl: 'price-info.html'
})
export class PriceInfoComponent {
  @Input() priceInfoForm: FormGroup;
  @Input() submitAttempt: Boolean;

  constructor() {}
}
