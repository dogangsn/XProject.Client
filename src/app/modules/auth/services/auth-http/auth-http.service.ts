import { Injectable } from '@angular/core';
import { map, observable, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { UsersTable } from 'src/app/models/auth/Fake/users.table';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    debugger;
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', email)
      .set('password', password)
      .set('client_id', 'adminclient')
      .set('client_secret', 'secret');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': '',
    });

    return this.http.post<any>(
      `${API_USERS_URL}identity/connect/token`,
      body.toString(),
      { headers: httpHeaders }
    );
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }
  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<UserModel | undefined> {

    debugger;
    const us = UsersTable.users[0];
    us.authToken = token;

    // const user = UsersTable.users.find((u: UserModel) => {
    //   return u.access_token === token;
    // });
    if (!us) {
      return of(undefined);
    }

    return of(us);
  }

  signIn(url: string, model: any): Observable<any> {
    debugger;

    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', model.userName)
      .set('password', model.password)
      .set('client_id', 'adminclient')
      .set('client_secret', 'secret');

    const fullUrl: string = `${API_USERS_URL}identity/connect/token`;

    return this.http.post<any>(fullUrl, body.toString(), {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    });
  }

}
