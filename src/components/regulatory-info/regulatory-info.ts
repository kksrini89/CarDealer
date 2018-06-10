import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'regulatory-info',
  templateUrl: 'regulatory-info.html'
})
export class RegulatoryInfoComponent {
  @Input() regInfoForm: FormGroup;
  @Input() submitAttempt: Boolean;
  constructor() {}
}
