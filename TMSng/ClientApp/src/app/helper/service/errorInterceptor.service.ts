import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { agToasterService } from './toaster.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return <any>next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          if (error.error.message != undefined)
            this.svcToaster.showFailure('An error occurred:' + error.error.message, "Http Error");
          else
            this.svcToaster.showFailure('An error occurred:' + error.message, "Http Error");
        } else if (error.error) {
          // The backend returned an unsuccessful response code.
          if (error.error.title) 
            this.svcToaster.showFailure(`${error.error.title}`, `${error.statusText}:`);
          else if (error.error.message)
            this.svcToaster.showFailure(`${error.error.message}`, `${error.error.fieldName}:`);
          else if (error.message)
            this.svcToaster.showFailure(`${error.message}`, `${error.statusText}:`);
          else
            this.svcToaster.showFailure(`${error.error.substring(0, 200)}`, `${ error.statusText }:`)
        }
        else {
          this.svcToaster.showFailure(`${error.error}`, `${error.statusText}:`);
        }
        return EMPTY;
      })
    );
  }
  constructor(private svcToaster: agToasterService) {
  }
}
