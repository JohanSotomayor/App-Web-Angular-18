import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import IProduct from '@shared/interfaces/IProduct';
import {ListCategories} from '@shared/enum/list-Categories.enum';
// import { NumericOnlyDirective } from '@shared/directives/numeric-only.directive';
import { Subject, takeUntil } from 'rxjs';


@Component({
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,MatFormFieldModule],
  selector: 'app-form-products',
  templateUrl: './form-products.component.html',
  styleUrls: ['./form-products.component.scss']
})
export class FormProductsComponent implements OnInit {

  @Input("option") option?: string = "create";
  @Input("itemToUpdate") itemToUpdate!: IProduct;
  @Output("createEvent") createEvent: EventEmitter<any> = new EventEmitter();
  @Output("cancelEvent") cancelEvent: EventEmitter<any> = new EventEmitter();

  destroyed$:Subject<void> = new Subject<void>();




  form: FormGroup = this.fb.group({
    FC_name: this.fb.control("", [Validators.required, Validators.minLength(3)]),
    FC_code: this.fb.control("", [Validators.required, Validators.minLength(4)]),
    FC_description: this.fb.control("", []),
    FC_hasIva: this.fb.control("", [ Validators.required]),
    FC_percentIva: this.fb.control("", [ Validators.required]),
    FC_price: this.fb.control("", [ Validators.required]),
    FC_stock: this.fb.control("", [ Validators.required]),
    FC_category: this.fb.control("", [ Validators.required]),
  });

listCategories : Array<ListCategories> = Object.values(ListCategories)


  constructor(private fb: FormBuilder) { }

  get name() : FormControl {
    return this.form.get("FC_name") as FormControl;
  }
  get code() : FormControl {
    return this.form.get("FC_code") as FormControl;
  }

  get description() : FormControl {
    return this.form.get("FC_description") as FormControl;
  }
  get hasIva() : FormControl {
    return this.form.get("FC_hasIva") as FormControl;
  }
  get percentIva() : FormControl {
    return this.form.get("FC_percentIva") as FormControl;
  }
  get price() : FormControl {
    return this.form.get("FC_price") as FormControl;
  }
  get stock() : FormControl {
    return this.form.get("FC_stock") as FormControl;
  }
  get category() : FormControl {
    return this.form.get("FC_category") as FormControl;
  }


  ngOnInit() {
    this.formChanges();
  }

  formChanges(){

    this.percentIva.disable()
    this.hasIva.valueChanges.subscribe({
      next: (value) => {
        if(value) this.percentIva.enable()
        else {
          this.percentIva.disable()
          this.percentIva.reset()
      }
      }
    })
  }

  createItem() {
      
    let product: IProduct = {
      name: this.name.value,
      code: this.code.value,
      description: this.description.value,
      hasIva: this.hasIva.value ,
      percentIva: this.percentIva.value || 0,
      price: this.price.value ,
      stock: this.stock.value ,
      categoryID: this.category.value ,
    };
    this.createEvent.emit(product);
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
