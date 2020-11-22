import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
  user: { email: string; expiresIn: string; id: string; isAdmin: boolean };
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private address: string = "http://localhost:3000/api";
  expirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCOZn4JYOaaBNji_1KzK_yzp5zfNIywyxM",
        `${this.address}/auth/register`,
        {
          email: email,
          password: password
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user.email,
            resData.user.id,
            +resData.user.expiresIn,
            resData.user.isAdmin
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        // "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCOZn4JYOaaBNji_1KzK_yzp5zfNIywyxM",
        `${this.address}/auth/login`,
        {
          email: email,
          password: password
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user.email,
            resData.user.id,
            +resData.user.expiresIn,
            resData.user.isAdmin
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem("svgUser");
    this.router.navigate(["/auth"]);
    if (this.expirationTimer) clearTimeout(this.expirationTimer);
    this.expirationTimer = null;
  }

  private handleAuthentication(
    email: string,
    userId: string,
    expiresIn: number,
    isAdmin: boolean
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, expirationDate, isAdmin);
    localStorage.setItem("svgUser", JSON.stringify(user));
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!";

    switch (errorRes.error) {
      case "EMAIL_EXISTS":
        // errorMessage = "This email exists already";
        errorMessage = "Ten email jest już zajęty";
        break;
      case "EMAIL_NOT_FOUND":
        // errorMessage = "This email does not exist.";
        errorMessage = "Podany email nie istnieje";
        break;
      case "INVALID_PASSWORD":
        // errorMessage = "This password is not correct.";
        errorMessage = "Niepoprawny login lub hasło";
        break;
      default:
        errorMessage = errorRes.error;
    }
    return throwError(errorMessage);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _tokenExpirationDate: string;
      isAdmin: boolean;
    } = JSON.parse(localStorage.getItem("svgUser"));
    if (!userData) return;
    const loadedUser = new User(
      userData.email,
      userData.id,
      new Date(userData._tokenExpirationDate),
      userData.isAdmin
    );
    if (loadedUser.id) {
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.user.next(loadedUser);
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
