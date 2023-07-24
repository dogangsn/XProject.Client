
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {ActionResponse} from "../models/bases/ActionResponse";


@Injectable({
    providedIn: 'root',
})
export class HttpService {
    apiAddress: string = environment.apiUrl;
    //  identityAddress: string = environment.identityUrl + '';
    constructor(private httpClient: HttpClient) { }

    get(url: string): Promise<any> {
        const fullUrl: string = this.apiAddress + url;
        return this.httpClient.get<Promise<any>>(fullUrl).toPromise();
    }

    post(url: string, body: any): Observable<any> {
        const fullUrl: string = this.apiAddress + url;
        return this.httpClient
            .post<Promise<any>>(fullUrl, body);

    }
    run<T>(url: string, body: any,options?: object): Observable<ActionResponse<T>> {
        const fullUrl: string = this.apiAddress + url;
        return this.httpClient.post<ActionResponse<T>>(fullUrl, body,options);

    }
    delete(url: string, body: any): Observable<any> {
        const fullUrl: string = this.apiAddress + url;
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: body
        };
        return this.httpClient.delete<Promise<any>>(fullUrl, options);
    }

    put(url: string, body: any): Observable<any> {
        const fullUrl: string = this.apiAddress + url;
        return this.httpClient
            .put<Promise<any>>(fullUrl, body);

    }


    signUp(url: string, body: any): Observable<any> {
        const fullUrl: string = this.apiAddress + url;
        return this.httpClient
            .post<Promise<any>>(fullUrl, body);

    }

    signIn(url: string, model: any): Observable<any> {
        const body = new HttpParams()
            .set('grant_type', 'password')
            .set('username', model.userName)
            .set('password', model.password)
            .set('client_id', 'adminclient')
            // .set('scope', model.scope)
            .set('client_secret', 'secret');

        const fullUrl: string = this.apiAddress + url;

        return this.httpClient.post<any>(fullUrl,
            body.toString(),
            { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') });



    }

    getRequest(url: string): Observable<any> {
        const fullUrl: string = this.apiAddress + url;
        return this.httpClient
            .get(fullUrl);
    }




   /*  private logTime(startMoment: Moment, url: string, method: string): void {
        const requestDuration = moment().diff(startMoment, 'milliseconds');

        this.logService.logHttpInfo(`HTTP ${method}`, requestDuration, url);
      } */


}
