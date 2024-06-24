import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import ISale from '@shared/interfaces/IRegisterSale';
import { BehaviorSubject, map, take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class RegisterSaleService {

private array: BehaviorSubject<Array<ISale>> = new BehaviorSubject([] as Array<ISale>);

constructor(private http: HttpClient) { }

setArray(value: Array<ISale>) {
  this.array.next(value);
}


getArray() {
  return this.array;
}

getAll() {
  this.http.get(`${environment.apiREST}/orders`).subscribe((result: any) => {
    console.log(result)
    if(result?.data?.length > 0) {
      this.setArray(result?.data);
    } else {
      this.setArray([])
    };
  })
}

create(client: ISale) {
  return this.http.post(`${environment.apiREST}/orders/`, client)
  .pipe(
    tap((result:any) => {
      let sales = result?.data;
      if(sales) {
        this.getAll()
      }
    })
  );
}

async createLocal(item: ISale) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    let arr = [...arrayData || []];
    arr.push(item);
    this.setArray(arr);
  }

}

delete(salesToDelete: any) {

  const idParams = salesToDelete
  console.log(idParams)
  return this.http.delete(`${environment.apiREST}/orders/?ids=${idParams}`).pipe(
    tap((result) => {
      console.log(result)
      if(result) {
        for(let sales of salesToDelete) {
          this.deleteLocal(sales);
        }
      }
    })
  )
}

deleteLocal(id: number) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    arrayData = arrayData.filter((data: ISale) => data.orderID != id);
    this.setArray(arrayData);
  }
}



}
