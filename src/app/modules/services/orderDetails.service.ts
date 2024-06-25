import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import IOrderDetail from '@shared/interfaces/IOrderDetails';
import ISale from '@shared/interfaces/IRegisterSale';
import { BehaviorSubject, map, take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class OrderDetailService {

private array: BehaviorSubject<Array<IOrderDetail | any>> = new BehaviorSubject([] as Array<IOrderDetail | any>);

constructor(private http: HttpClient) { }

setArray(value: Array<IOrderDetail>) {
  this.array.next(value);
}


getArray() {
  return this.array;
}

getAll(id:number) {
  this.http.get(`${environment.apiREST}/orderDetails/${id}`).subscribe((result: any) => {
    console.log(result)
    if(result?.data) {
      this.setArray(result?.data);
    } else {
      this.setArray([])
    };
  })
}

create(orderD: Array<IOrderDetail>) {
  return this.http.post(`${environment.apiREST}/orderDetails/`, orderD)
  .pipe(
    tap((result:any) => {
      let sales = result?.data;
    //   if(sales) {
    //     this.getAll()
    //   }
    })
  );
}

delete(orderDetailsToDelete: any) {

  const idParams = orderDetailsToDelete
  console.log(idParams)
  return this.http.delete(`${environment.apiREST}/orderDetails/?ids=${idParams}`).pipe(
    tap((result) => {
      console.log(result)
      if(result) {
        for(let sales of orderDetailsToDelete) {
          this.deleteLocal(sales);
        }
      }
    })
  )
}

deleteLocal(id: number) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    arrayData = arrayData.filter((data: IOrderDetail ) => data.orderDetailID != id);
    this.setArray(arrayData);
  }
}



}
