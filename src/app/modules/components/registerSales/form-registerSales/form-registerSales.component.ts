import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, FormBuilder, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatTable, MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import ISale from '@shared/interfaces/IRegisterSale';
import IClient from '@shared/interfaces/IClient';
import IProduct from '@shared/interfaces/IProduct';
import IOrderDetail from '@shared/interfaces/IOrderDetails';
import { ClientsService } from '@modules/services/clients.service';
import { ProductsService } from '@modules/services/products.service';

import {ListCategories} from '@shared/enum/list-Categories.enum';
// import { NumericOnlyDirective } from '@shared/directives/numeric-only.directive';
import { Subject, takeUntil } from 'rxjs';
import { ImagePlaceholderConfig } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule,MatSelectModule,MatTableModule, MatButtonModule,MatFormFieldModule],
  providers:[provideNativeDateAdapter()],
  selector: 'form-registerSales',
  templateUrl: './form-registerSales.component.html',
  styleUrls: ['./form-registerSales.component.scss']
})

export class FormRegisterSalesComponent implements OnInit, OnChanges  {

  @ViewChild(MatTable) table?: MatTable<any>;
  @Input("option") option?: string = "create";
  @Input("registerProducts") registerProducts?: boolean ;
  @Input("itemToUpdate") itemToUpdate!: ISale;
  @Input("orderSelect") orderSelect?: ISale | null;
  @Output("createEvent") createEvent: EventEmitter<any> = new EventEmitter();
  @Output("createOrderEvent") createOrderEvent: EventEmitter<any> = new EventEmitter();
  @Output("cancelEvent") cancelEvent: EventEmitter<any> = new EventEmitter();

  destroyed$:Subject<void> = new Subject<void>();

  listClient : Array<IClient> =[]
  listProduct : Array<IProduct> =[]
  listCategories : Array<ListCategories> = Object.values(ListCategories)
  
  form: FormGroup = this.fb.group({
    FC_consecutive: this.fb.control("", [Validators.required, Validators.minLength(8)]),
    FC_orderDate: this.fb.control("", [Validators.required]),
    FC_totalAmount: this.fb.control("", [Validators.required]),
    FC_clientName: this.fb.control("", [ Validators.required]),
  });


  formDetail: FormGroup = this.fb.group({
    FC_products: this.fb.control([], [Validators.required]),
  });

   displayedColumns: Array<string> = ['Codigo', 'Nombre', 'Cantidad', 'Valor unidad', 'Porcentaje Iva', 'Iva calculado','Total'];
  //  dataSource:Array<any> = [{code:185, name: 'sasas', price:500}];
   dataSource= new MatTableDataSource()



  constructor(private fb: FormBuilder, private clientsService:ClientsService, private productsService:ProductsService) { }

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

  get products() : FormControl {
    return this.formDetail.get("FC_products") as FormControl;
  }


  


  ngOnInit() {

    if(this.option=='detail'){
      this.patchValues()
    }else  {
      this.formChanges();
    }
    this.getClients();
    this.getProducts();
   

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderSelect']) {
      const currentValue = changes['orderSelect'].currentValue;
      console.log('Order changed to:', currentValue);
      if(this.option=='detail') this.patchValues()
      

    }
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
  getProducts() {
    this.productsService.getAll();
    this.productsService.getArray().subscribe({
      next: (products: Array<IProduct>) => {
          this.listProduct = products;
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });
  }

  formChanges(){

    this.products.valueChanges.subscribe({
      next: (value:Array<any>) => {
        if(value.length){
          let data: Array<any>= value.map((product:any)=>{
            let montoIVA: number = 0;
            if (product?.percentIva) {
              montoIVA = product.price * product?.percentIva ;
            }
              return{
              code:product.code, 
              name: product.name, 
              price:product.price, 
              amount: product?.amount || 1 , 
              percentIva: product?.percentIva || 0,
              calIva: montoIVA|| 0,
              total: product?.total || product.price
          }
        })
          this.dataSource.data= data;
          console.log('products', this.products.value)
        }
      }
    })

  }

  patchValues(){
    
  
  if(Object.keys(this.orderSelect!).length > 0){

    console.log('entramosss', this.orderSelect)


    this.consecutive.patchValue(this.orderSelect!.consecutive)
    this.orderDate.patchValue(new Date(this.orderSelect!.orderDate))
    this.totalAmount.patchValue(this.orderSelect!.totalAmount)
    this.clientName.patchValue(this.orderSelect!.clientID)

    this.form.disable()
    
    // this.products.patchValue()


    let data: Array<any>= this.orderSelect!.orderDetails!.map((product:any)=>{
      let montoIVA: number = 0;
      if (product?.percentIva) {
        montoIVA = product.price * product?.percentIva ;
      }
        return{
        code:product.productCode, 
        name: product.productName, 
        price:product.productPrice, 
        amount: product?.quantity || 1 , 
        percentIva: product?.productPercentIva || 0,
        calIva: product?.AmountIva || 0,
        total: Math.round(product.productPrice * product.quantity)
    }
  })
    this.dataSource.data= data;
  }

  
  }


  inputChanges(event: number, element:any){

    let value: number =Number(event);
    element['amount'] = value > 0? value : 1;
    element['total'] = Math.round(element.price * element.amount)
    let index:number = this.products.value.findIndex( (product:any )=> product.code === element.code)
    this.products.value[index].amount=  element['amount']
    this.products.value[index].total=  element['total']
    
  }

  getTotal() {
    return this.dataSource.data.map((item:any) => Number(item.total)).reduce((acc, value) => acc + value, 0)
  }

  createItem() {
      
    let sale: ISale = {
      consecutive: this.consecutive.value,
      orderDate: this.orderDate.value,
      totalAmount: this.totalAmount.value  || 0 ,
      clientID: this.clientName.value,

    };
    this.createEvent.emit(sale);

  }
  createOrderDetail() {

    let OrderD: Array<IOrderDetail> = this.products.value.map((product:any)=>{
        let montoIVA: number = 0;
        if (product?.percentIva) {
          montoIVA = product.price * product?.percentIva ;
        }
        return{
        productID: product.productID,
        name: product.name, 
        unitPrice:product.price, 
        quantity: product?.amount || 1 , 
        amountIva: montoIVA|| 0,
    }
  })
    this.createOrderEvent.emit(OrderD);
    // this.resetForm();
  }


  getDetail(){
    // this.clientsService.getAll();
    // this.clientsService.getArray().subscribe({
    //   next: (clients: Array<IClient>) => {
    //       this.listClient = clients;
    //   },
    //   error: (error: any) => {
    //     console.log("ERROR");
    //   }
    // });
  }

  resetForm() {
    this.form.reset({});
    this.form.enable({});
    this.formDetail.reset({});
    this.dataSource.data= []
  }

  disabledForm() {
    this.form.disable();
  }
 

  cancel() {
    this.resetForm();
    this.cancelEvent.emit();
  }

}
