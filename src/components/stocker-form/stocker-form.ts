import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'stocker-form',
  templateUrl: 'stocker-form.html'
})
export class StockerFormComponent {
  @Input() stockerForm: FormGroup;
  @Input() submitAttempt: Boolean;

  public transmission_types: String[] = ['Manual', 'Automatic'];
  public fuel_types: String[] = ['Petrol', 'Petrol/LPG', 'Diesel'];

  constructor() {}
}
