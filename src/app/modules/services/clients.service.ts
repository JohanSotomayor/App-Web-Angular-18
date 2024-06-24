import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import IClient from '@shared/interfaces/IClient';
import { BehaviorSubject, map, take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ClientsService {

private array: BehaviorSubject<Array<IClient>> = new BehaviorSubject([] as Array<IClient>);

constructor(private http: HttpClient) { }

setArray(value: Array<IClient>) {
  this.array.next(value);
}


getArray() {
  return this.array;
}

getAll() {
  this.http.get(`${environment.apiREST}/clients`).subscribe((result: any) => {
    console.log(result)
    if(result?.data?.length > 0) {
      this.setArray(result?.data);
    } else {
      this.setArray([])
    };
  })
}

create(client: IClient) {
  return this.http.post(`${environment.apiREST}/clients/`, client)
  .pipe(
    tap((result:any) => {
      let client = result?.data;
      if(client) {
        this.createLocal(client)
      }
    })
  );
}

async createLocal(item: IClient) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    let arr = [...arrayData || []];
    arr.push(item);
    this.setArray(arr);
  }

}



delete(clientsToDelete: any) {

  const idParams = clientsToDelete
  console.log(idParams)
  return this.http.delete(`${environment.apiREST}/clients/?ids=${idParams}`).pipe(
    tap((result) => {
      console.log(result)
      if(result) {
        for(let client of clientsToDelete) {
          this.deleteLocal(client);
        }
      }
    })
  )
}

deleteLocal(id: number) {
  let arrayData = this.array.getValue();
  if(arrayData?.length > 0) {
    arrayData = arrayData.filter((data: IClient) => data.clientID != id);
    this.setArray(arrayData);
  }
}




// updateLocal(item: IClient) {
//   let arrayData = this.array.getValue();
//   if(arrayData?.length > 0) {
//     let arr = JSON.parse(JSON.stringify([...arrayData || []])) as Array<IClient>;//Se remueve el readonly | inmutabilidad del observable
//     for(let doc of arr) {
//       if(doc.id == item.id) {
//         doc.name = item.name;
//         doc.email = item.email;
//         doc.taxid = item.taxid;
//         doc.taxidVD = item.taxidVD;
//         doc.address = item.address;
//         doc.phone = item.phone;
//         doc.taxpayerType = item.taxpayerType;
//         doc.economicSector = item.economicSector;
//         doc.activityCode = item.activityCode;
//         break;
//       }
//     }
//     this.setArray(arr);
//   }

// }



}
