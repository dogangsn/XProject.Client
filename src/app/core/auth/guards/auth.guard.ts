import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanMatch
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can match
     *
     * @param route
     * @param segments
     */
    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        return this._check('/');
    }

       /**
     * Can activate
     *
     * @param route
     * @param state
     */
       canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
       {
   
   
           const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
           console.log(redirectUrl);
   
           const logged = this._authService.isLoggedIn();
           if (!logged) {
               this._router.navigate(['sign-in'], {queryParams: {redirectUrl}});
               return false;
             }
   
             return true;
   
          // return this._check(redirectUrl);
       }
   
       /**
        * Can activate child
        *
        * @param childRoute
        * @param state
        */
       canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
       {
           const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
           return this._check(redirectUrl);
       }
 

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param segments
     * @private
     */
    // private _check(segments: UrlSegment[]): Observable<boolean | UrlTree>
    // {
    //     // Check the authentication status
    //     return this._authService.check().pipe(
    //         switchMap((authenticated) => {

    //             // If the user is not authenticated...
    //             if ( !authenticated )
    //             {
    //                 // Redirect to the sign-in page with a redirectUrl param
    //                 const redirectURL = `/${segments.join('/')}`;
    //                 const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

    //                 return of(urlTree);
    //             }

    //             // Allow the access
    //             return of(true);
    //         })
    //     );
    // }
    private _check(redirectURL: string): Observable<boolean>
    {
        const logged = this._authService.isLoggedIn();
        if (!logged) {
            this._router.navigate(['sign-in'], {queryParams: {redirectURL}});
            return of(false);
          }

          return of(true);
        // Check the authentication status
      /*   return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {
                        console.log(authenticated);
                           // If the user is not authenticated...
                           if ( !authenticated )
                           {
                               // Redirect to the sign-in page
                               this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

                               // Prevent the access
                               return of(false);
                           }

                           // Allow the access
                           return of(true);
                       })
                   ); */
    }
}
