import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import ISale from '@shared/interfaces/IRegisterSale';
import IClient from '@shared/interfaces/IClient';
import { ClientsService } from '@modules/services/clients.service';

import {ListCategories} from '@shared/enum/list-Categories.enum';
// import { NumericOnlyDirective } from '@shared/directives/numeric-only.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule,MatDatepickerModule,  MatSelectModule, MatButtonModule,MatFormFieldModule],
  providers:[provideNativeDateAdapter()],
  selector: 'form-registerSales',
  templateUrl: './form-registerSales.component.html',
  styleUrls: ['./form-registerSales.component.scss']
})
export class FormRegisterSalesComponent implements OnInit {


  @Input("option") option?: string = "create";
  @Input("itemToUpdate") itemToUpdate!: ISale;
  @Output("createEvent") createEvent: EventEmitter<any> = new EventEmitter();
  @Output("cancelEvent") cancelEvent: EventEmitter<any> = new EventEmitter();

  destroyed$:Subject<void> = new Subject<void>();

listClient : Array<IClient> =[]

  form: FormGroup = this.fb.group({
    FC_consecutive: this.fb.control("", [Validators.required, Validators.minLength(8)]),
    FC_orderDate: this.fb.control("", [Validators.required]),
    FC_totalAmount: this.fb.control("", [Validators.required]),
    FC_clientName: this.fb.control("", [ Validators.required]),
  });

listCategories : Array<ListCategories> = Object.values(ListCategories)


  constructor(private fb: FormBuilder, private clientsService:ClientsService) { }

  get consecutive() : FormControl {
    return this.form.get("FC_consecutive") as FormControl;
  }
  get orderDate() : FormControl {
    return this.form.get("FC_orderDate") as FormControl;
  }

  get totalAmount() : FormControl {
    return this.form.get("FC_totalAmount") as FormControl;
  }
  get clientName() : FormControl {
    return this.form.get("FC_clientName") as FormControl;
  }
 


  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this.clientsService.getAll();
    this.clientsService.getArray().subscribe({
      next: (clients: Array<IClient>) => {
          this.listClient = clients;
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });
  }

  formChanges(){

    // this.percentIva.disable()
    // this.hasIva.valueChanges.subscribe({
    //   next: (value) => {
    //     if(value) this.percentIva.enable()
    //     else {
    //       this.percentIva.disable()
    //       this.percentIva.reset()
    //   }
    //   }
    // })
  }

  createItem() {
      
debugger
    let sale: ISale = {
      consecutive: this.consecutive.value,
      orderDate: this.orderDate.value,
      totalAmount: this.totalAmount.value  || 0 ,
      clientID: this.clientName.value,

    };
    this.createEvent.emit(sale);
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
