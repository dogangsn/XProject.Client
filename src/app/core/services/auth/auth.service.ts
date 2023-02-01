import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../../../modules/auth/models/user.model';
import { AuthModel } from '../../../modules/auth/models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http/auth-http.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // login(email: string, password: string): Observable<any> {
  //   this.isLoadingSubject.next(true);

  //   return this.authHttpService.login(email, password).pipe(
  //     // map((auth: AuthModel) => {
  //     //   const result = this.setAuthFromLocalStorage(auth);
  //     //   return result;
  //     // }),
  //     switchMap(async (response: any) => {
  //       //this.getUserByToken()
  //       console.log(response);
  //     }),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }



  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  // getUserByToken(): Observable<UserType> {

  //   debugger;
  //   const auth = this.getAuthFromLocalStorage();
  //   if (!auth) {
  //     return of(undefined);
  //   }
  //   const user = UsersTable.users[0];
  //   user.authToken = auth.access_token;
  //   if (user) {
  //     this.currentUserSubject.next(user);
  //   } else {
  //     this.logout();
  //   }
  //   return user;

  //   // this.isLoadingSubject.next(true);
  //   // return this.authHttpService.getUserByToken(auth.access_token).pipe(
  //   //   map((user: UserType) => {
  //   //     if (user) {
  //   //       this.currentUserSubject.next(user);
  //   //     } else {
  //   //       this.logout();
  //   //     }
  //   //     return user;
  //   //   }),
  //   //   finalize(() => this.isLoadingSubject.next(false))
  //   // );
  // }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.access_token).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  signIn(email: string, password: string): Observable<any> {
    // Throw error, if the user is already logged in

    const user = {
      userName: email,
      password: password,
    };

    return this.authHttpService.signIn('', user).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(async (response: any) => {
        debugger;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('defaultLanguages');
        localStorage.removeItem('enterprise');
        localStorage.removeItem('activeLang');
        // Store the access token in the local storage
        this.getUserByToken();
        // Return a new observable with the response
        return of(response);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
