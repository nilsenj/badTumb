import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUtils } from '../utils/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = AuthUtils.getAuthToken();
    if (authToken) {
      const copiedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });

      return next.handle(copiedReq);
    }

    return next.handle(req);
  }
}
