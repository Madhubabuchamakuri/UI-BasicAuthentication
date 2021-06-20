import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    baseUrl = environment.baseUrl;
    apiUrls = {
        signup: '/api/v1/user/sign-up',
        login: '/api/v1/auth/login',
        validateOtp: '/api/v1/auth/opt-validation',
        logout: '/api/v1/auth/logout',
        forceLogout:"/api/v1/auth/force-logout/",
        validateSession:"/api/v1/auth/success"
    };

    constructor(
        private http: HttpClient,
        private router: Router) {
    }

    getService(url: string, params?: any) {
        return this.http
            .get(this.baseUrl + url, { params: params })
            .pipe(
                map((response: any) => {
                    return response;
                })
            )
            .pipe(catchError(this.handleError));
    }

    postService(url:string, data:any) {
        return this.http.post(this.baseUrl + url, data)
            .pipe(map((response: any) => {
                    return response;
                }, (error:any) => {
                    console.log('Error From API', error);
                })
            )
            .pipe(catchError(this.handleError));
    }

    private handleError(error:any) {        
        if (error.status !=200) {
            if (error.error) {
                error.error.message = error.error.message ? error.error.message : 'Something Went Wrong';
            }
            else {
                error.meassage = 'Something Went Wrong';
            }
        }
        return throwError(error);
    }
}
