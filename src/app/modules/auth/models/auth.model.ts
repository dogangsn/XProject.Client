export class AuthModel {
  access_token: string;
  refreshToken: string;
  expiresIn: Date;

  setAuth(auth: AuthModel) {
    this.access_token = auth.access_token;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    
 
    
  }
}
