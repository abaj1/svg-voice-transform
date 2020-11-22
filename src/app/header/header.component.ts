import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
  }
  isLogged: boolean = true;
  isAdmin: boolean = false;
  user: User;
  private userSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(
      (user) => {
        this.user = user
        this.isLogged = !!user;
        if(user){
          this.isAdmin = user.isAdmin;
        }
      },
      (error) => console.log(error.error.message)
    );
  }

  onLogout() {
    this.authService.logout();
  }
}
