import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { map, take } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          const userData: {
            email: string;
            id: string;
            _tokenExpirationDate: string;
            isAdmin: boolean;
          } = JSON.parse(localStorage.getItem("svgUser"));
          const loadedUser = new User(
            userData.email,
            userData.id,
            new Date(new Date().getTime() + 3600 * 1000),
            userData.isAdmin
          );
          localStorage.setItem("svgUser", JSON.stringify(loadedUser));

          return true;
        }
        return this.router.createUrlTree(["/auth"]);
      })
    );
  }
}
