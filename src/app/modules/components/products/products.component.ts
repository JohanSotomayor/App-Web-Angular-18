import { Component, OnDestroy, OnInit, Signal, ViewChild, signal } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FormProductsComponent } from './form-products/form-products.component';
import IProduct from '@shared/interfaces/IProduct';
import { ProductsService } from '@modules/services/products.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '@shared/components/dynamic-table/dynamic-table.component';
import ITableColumn from '@shared/interfaces/ITableColumn';


@Component({
  standalone: true,
  imports: [MatSidenavModule, FormProductsComponent, DynamicTableComponent],
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @ViewChild("form") formComponent?: FormProductsComponent;
  @ViewChild("dynamicTable") dynamicTable?: DynamicTableComponent;
  @ViewChild("sidebar") sidebar?: MatDrawer;
  destroyed$:Subject<void> = new Subject<void>();

  formOption: string = "";
  itemToUpdate!: IProduct;
  array = signal([] as Array<IProduct>)

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.getAll();
  }


  setCreateItem() {
    this.formOption = "create";
    this.sidebar?.toggle();
  }

  getAll() {
    this.productsService.getAll();
    this.productsService.getArray().subscribe({
      next: (clients: Array<IProduct>) => {
        this.array.set([...clients]);
        this.setColumnsToTable();
        this.setDataToTable(this.array());
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });
  }

  setDataToTable(array: Signal<IProduct> | Array<any>) {
    this.dynamicTable?.setDataToTable(array);
  }

  setColumnsToTable() {

    // categoryID?: number
    let columns: Array<ITableColumn> = [
      { name: "select", viewValue: "", sortable: false, sticky: true },
      { name: "name", viewValue: "Nombre", sortable: true, sticky: true },
      { name: "code", viewValue: "Codigo", sortable: false, sticky: true },
      { name: "description", viewValue: "Descripcion", sortable: true, sticky: false },
      { name: "hasIva", viewValue: "Aplica IVA?", sortable: false, sticky: false },
      { name: "percentIva", viewValue: "Porcentaje IVA", sortable: false, sticky: false },
      { name: "price", viewValue: "Precio", sortable: false, sticky: false, isCurrency:true },
      { name: "stock", viewValue: "Cantidad", sortable: false, sticky: false },
      { name: "categoryName", viewValue: "Categoria", sortable: false, sticky: false },
    ];
    this.dynamicTable?.setDisplayedColumns(columns);
  }

  createItem(product: IProduct) {
    Swal.fire({toast: true, position: "top-end", title: "Creando", showConfirmButton: false, timer:2000, didOpen: () => Swal.showLoading()})
    this.productsService.create(product).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result: any) => {
        console.log(result);
          this.formComponent?.resetForm();
          this.sidebar?.toggle();
        // }
      },
      error: (error: any) => {

      }
    })
  }



  deleteItem(product: Array<IProduct>) {
    let productsToDelete = product.length == 1 ? [product[0].productID] : product.map((client: IProduct) => client.productID)
    
    this.productsService.delete(productsToDelete).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result: any) => {
        this.dynamicTable?.clearSelection();
      },
      error: (error: any) => {
      }
    })
  }

  cancel() {
    this.sidebar?.toggle();
    this.formOption = "";
  }

  ngOnDestroy(): void {
    this.destroyed$.next()
  }

}