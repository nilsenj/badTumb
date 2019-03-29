import {Component, EventEmitter, OnInit, Output, ViewContainerRef} from "@angular/core";
import {AuthenticationService} from "./services/authentication.service";
import {routeAnimation} from "./app.animations";

interface IDataStore {
    user: any;
    authenticated: boolean;
}

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    animations: [routeAnimation],
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    public user = [];
    public authenticated: boolean = false;
    @Output() userChange = new EventEmitter();

    constructor(protected userService: AuthenticationService,
                vcr: ViewContainerRef) {
    }

    public getState(outlet): void {
        return outlet.activatedRouteData.state;
    }

    ngOnInit(): void {
        // get users from secure api end point
        this.getUser();
        this.userChanged();
    }

    public userChanged(): void {
        this.userService.userChange.subscribe(data => {
            if (data) {
                this.user = data;
                this.authenticated = true;
                let dataStore: IDataStore = {
                    user: this.user,
                    authenticated: this.authenticated
                };
                this.userChange.emit(dataStore);
            } else {
                this.user = null;
                this.authenticated = false;
                this.userChange.emit(null);
            }
        });
    }

    // get users from secure api end point
    public getUser(): void {
        if (this.userService.token) {
            this.user = this.userService.getUser();
            this.authenticated = true;
            let dataStore: IDataStore = {
                user: this.user,
                authenticated: this.authenticated
            };
            this.userChange.emit(dataStore);
        } else {
            this.authenticated = false;
            this.userChange.emit(null);
        }
    }
}
