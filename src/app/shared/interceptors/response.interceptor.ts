import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, catchError, filter, tap } from "rxjs";
import { Injectable } from "@angular/core";
import Swal from "sweetalert2";


export function RestResponseInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
        return next(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error && error.error) {
                    debugger
                    
                    let errorMessage: string;
                    console.log("error", error)
                    
                        if(error.status == 409) {
                            Swal.fire({
                                icon: "warning",
                                toast: true,
                                position: "bottom",
                                title: error.error.message || "",
                                // html: error?.detail || "",
                                timer: 10000,
                                showConfirmButton: false
                            });
                        } else if(error.status == 404) {
                            Swal.fire({
                                icon: "error",
                                toast: true,
                                position: "bottom",
                                title: error.error.message || "Error Not found",
                                // html: error.detail || "",
                                timer: 10000,
                                showConfirmButton: false
                            });
                        } else if(error.status == 500) {
                            Swal.fire({
                                icon: "error",
                                toast: true,
                                position: "bottom",
                                title: error.error.message || "Error al realizar operación",
                                // html: error.detail || "",
                                timer: 10000,
                                showConfirmButton: false
                            });
                        }
                }
                throw new Error("Error de Backend");
            }),
        )
}