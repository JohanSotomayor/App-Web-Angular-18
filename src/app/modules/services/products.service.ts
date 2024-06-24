import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import IProduct from '@shared/interfaces/IProduct';
import { BehaviorSubject, map, take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ProductsService {

private array: BehaviorSubject<Array<IProduct>> = new BehaviorSubject([] as Array<IProduct>);

constructor(private http: HttpClient) { }

setArray(value: Array<IProduct>) {
  this.array.next(value);
}


getArray() {
  return this.array;
}

getAll() {
  this.http.get(`${environment.apiREST}/products`).subscribe((result: any) => {
    console.log(result)
    if(result?.data?.length > 0) {
      this.setArray(result?.data);
    } else {
      this.setArray([])
    };
  })
}

create(client: IProduct) {
  return this.http.post(`${environment.apiREST}/products/`, client)
  .pipe(
    tap((result:any) => {
      let client = result?.data;
      if(client) {
        this.getAll()
      }
    })
  );
}

async createLocal(item: IProduct) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    let arr = [...arrayData || []];
    arr.push(item);
    this.setArray(arr);
  }

}

delete(productsToDelete: any) {

  const idParams = productsToDelete
  console.log(idParams)
  return this.http.delete(`${environment.apiREST}/products/?ids=${idParams}`).pipe(
    tap((result) => {
      console.log(result)
      if(result) {
        for(let client of productsToDelete) {
          this.deleteLocal(client);
        }
      }
    })
  )
}

deleteLocal(id: number) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    arrayData = arrayData.filter((data: IProduct) => data.productID != id);
    this.setArray(arrayData);
  }
}



}
