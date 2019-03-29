import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { take } from 'rxjs/operators';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})

export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = "";

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    // reset login status
    this.authenticationService.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        this.authenticationService.logout();
      }
    });
  }

  login(): void {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(["/posts"]);
          this.authenticationService.userEvent.emit(result);
          console.log(result);
          console.log("info", "You are logged in!");
        } else {
          this.error = "Username or password is incorrect";
          this.loading = false;
        }
      }, (error) => {
        this.error = "Username or password is incorrect";
        this.loading = false;
      });
  }
}
