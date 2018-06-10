import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'stocker-form',
  templateUrl: 'stocker-form.html'
})
export class StockerFormComponent {
  @Input() stockerForm: FormGroup;
  @Input() submitAttempt: Boolean;

  constructor() {}
}
