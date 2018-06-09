import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'stocker-form',
  templateUrl: 'stocker-form.html'
})
export class StockerFormComponent {
  public stockerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loadStockerForm();
  }

  loadStockerForm(): void {
    this.stockerForm = this.formBuilder.group({
      firstName: ['value'],
      lastName: ['value'],
      age: ['value']
    });
  }
}
