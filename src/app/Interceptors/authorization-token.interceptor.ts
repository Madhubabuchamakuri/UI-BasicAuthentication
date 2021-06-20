import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class AuthorizationTokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let loggedInUserStringValue=localStorage.getItem('loggedInUser');    
    if(loggedInUserStringValue){        
        let loggedInUser = JSON.parse(loggedInUserStringValue)
        if (loggedInUser && loggedInUser.token) {            
            req = req.clone({
                setHeaders: {
                    'Content-Type' : 'application/json; charset=utf-8',
                    'Accept'       : 'application/json',
                    'Authorization': loggedInUser.token,
                }
            });

        }
    }
   
    return next.handle(req);
  }
}