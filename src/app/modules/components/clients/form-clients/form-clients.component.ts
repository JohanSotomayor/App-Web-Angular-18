import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import IClient from '@shared/interfaces/IClient';
// import { NumericOnlyDirective } from '@shared/directives/numeric-only.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'form-clients',
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,MatFormFieldModule],
  templateUrl: './form-clients.component.html',
  styleUrls: ['./form-clients.component.scss']
})
export class FormClientsComponent implements OnInit {
  @Input("option") option?: string = "create";
  @Input("itemToUpdate") itemToUpdate!: IClient;
  @Output("createEvent") createEvent: EventEmitter<any> = new EventEmitter();
  @Output("cancelEvent") cancelEvent: EventEmitter<any> = new EventEmitter();

  destroyed$:Subject<void> = new Subject<void>();

  // clientID?: number,
  // cardId: string,
  // name?: string,
  // address?: string | null,
  // phone: string,
  // email: number | null ,
  
  form: FormGroup = this.fb.group({
    FC_name: this.fb.control("", [Validators.required, Validators.minLength(3)]),
    FC_cardId: this.fb.control("", [Validators.required, Validators.minLength(7)]),
    FC_address: this.fb.control("", [Validators.minLength(3)]),
    FC_phone: this.fb.control("", [ Validators.minLength(3)]),
    FC_email: this.fb.control("", [Validators.required, Validators.minLength(3), Validators.email]),
  });

  activityCodesOptions: Array<any> = [];


  constructor(private fb: FormBuilder) { }

  get name() : FormControl {
    return this.form.get("FC_name") as FormControl;
  }
  get cardId() : FormControl {
    return this.form.get("FC_cardId") as FormControl;
  }

  get address() : FormControl {
    return this.form.get("FC_address") as FormControl;
  }
  get phone() : FormControl {
    return this.form.get("FC_phone") as FormControl;
  }
  get email() : FormControl {
    return this.form.get("FC_email") as FormControl;
  }


  ngOnInit() {

  }

  createItem() {
      
    let client: IClient = {
      name: this.name.value,
      cardId: this.cardId.value,
      address: this.address.value,
      phone: this.phone.value,
      email: this.email.value || null,
    };
    this.createEvent.emit(client);
    // this.resetForm();
  }


  resetForm() {
    this.form.reset({});
  }

  cancel() {
    this.resetForm();
    this.cancelEvent.emit();
  }

}
