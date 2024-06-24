import { Component, OnDestroy, OnInit, Signal, ViewChild, signal } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FormClientsComponent } from './form-clients/form-clients.component';
import IClient from '@shared/interfaces/IClient';
import { ClientsService } from '@modules/services/clients.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '@shared/components/dynamic-table/dynamic-table.component';
import ITableColumn from '@shared/interfaces/ITableColumn';


@Component({
  standalone: true,
  selector: 'clients',
  imports: [MatSidenavModule, FormClientsComponent, DynamicTableComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})


export class ClientsComponent implements OnInit, OnDestroy {
  @ViewChild("form") formComponent?: FormClientsComponent;
  @ViewChild("dynamicTable") dynamicTable?: DynamicTableComponent;
  @ViewChild("sidebar") sidebar?: MatDrawer;
  destroyed$:Subject<void> = new Subject<void>();

  formOption: string = "";

  itemToUpdate!: IClient;
  array = signal([] as Array<IClient>)

  constructor(private clientsService: ClientsService) { }

  ngOnInit() {
    this.getAll();
  }


  setCreateItem() {
    this.formOption = "create";
    this.sidebar?.toggle();
  }

  getAll() {
    this.clientsService.getAll();
    this.clientsService.getArray().subscribe({
      next: (clients: Array<IClient>) => {
        this.array.set([...clients]);
        this.setColumnsToTable();
        this.setDataToTable(this.array());
      },
      error: (error: any) => {
        console.log("ERROR");
      }
    });
  }

  setDataToTable(array: Signal<IClient> | Array<any>) {
    this.dynamicTable?.setDataToTable(array);
  }

  setColumnsToTable() {
    let columns: Array<ITableColumn> = [
      { name: "select", viewValue: "", sortable: false, sticky: true },
      { name: "name", viewValue: "Nombre", sortable: true, sticky: true },
      { name: "cardId", viewValue: "Cedula", sortable: false, sticky: true },
      { name: "email", viewValue: "Correo", sortable: true, sticky: false },
      { name: "phone", viewValue: "Telefono", sortable: false, sticky: false },
    ];
    this.dynamicTable?.setDisplayedColumns(columns);
  }

  createItem(client: IClient) {
    Swal.fire({toast: true, position: "top-end", title: "Creando", showConfirmButton: false, timer:2000, didOpen: () => Swal.showLoading()})
    this.clientsService.create(client).pipe(takeUntil(this.destroyed$)).subscribe({
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



  deleteItem(clients: Array<IClient>) {
    let clientsToDelete = clients.length == 1 ? [clients[0].clientID] : clients.map((client: IClient) => client.clientID)
    
    this.clientsService.delete(clientsToDelete).pipe(takeUntil(this.destroyed$)).subscribe({
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
