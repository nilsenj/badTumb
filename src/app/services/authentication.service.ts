import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Input, Output } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { app } from '../../config/app';
import { User } from '../models/User';
import { arrays } from '../helpers/arrays';

@Injectable()
export class AuthenticationService {

  private currentUserSubject$: BehaviorSubject<any>;
  isLoggedIn$: BehaviorSubject<boolean>;

  /**
   * @param token {string}
   */
  public token: string;
  /**
   * emit events
   *
   * @type {EventEmitter}
   */
  public userEvent: EventEmitter<any> = new EventEmitter();
  @Output() userChange = new EventEmitter();
  @Input() user: any;
  @Input() authenticated: boolean;

  constructor(@Inject(HttpClient) private http: HttpClient) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.currentUserSubject$ = new BehaviorSubject<any>(currentUser);
    this.isLoggedIn$ = new BehaviorSubject<boolean>(!!this.token);
    if (!!this.token) {
      this.getUser();
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject$.value;
  }

  /**
   * register this asshole
   *
   * @param email
   * @param password
   * @returns {Observable<R>}
   */
  login(email: string, password: string): any {
    return this.http.post(app.api_url + "/api/login", {email: email, password: password})
      .pipe(map((response: any) => {
        // login successful if there's a jwt token in the response
        const token = !!response && response.meta.token;
        if (token) {
          console.log(token);
          // set token property
          this.token = token;
          this.userEvent.emit(response);
          response.authenticated = true;
          const name = !!response.data.name ? response.data.name : "";
          const currentUser = JSON.stringify({name: name, email: email, token: token});
          // store email and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", currentUser);
          this.getUser();
          this.userChange.emit(response);
          this.currentUserSubject$.next(currentUser);
          this.isLoggedIn$.next(!!this.token);

          // return true to indicate successful login
          return true;
        }
        this.isLoggedIn$.next(false);
        return false;
      }));
  }

  getUser(): any {
    this.user = this.getAuthenticatedUser().pipe(take(1)).subscribe((users) => {
      console.log(users);
      if (this.token) {
        this.user = arrays.transformToArray(users);
        this.authenticated = true;
        this.user.authenticated = true;
        this.userChange.emit(this.user);
      }
    }, (error) => {
      console.log(error);
      this.user = [];
      this.authenticated = false;
      this.token = '';
      localStorage.removeItem("currentUser");
      localStorage.removeItem("io");
      this.userChange.emit(null);
      this.logout();
    });

    return this.user;
  }

  /**
   * get all users
   *
   * @returns {Observable<R>}
   */
  getUsers(): Observable<User[]> {
    // get users from api
    return this.http.get(app.api_url + "/api/users")
      .pipe(
        map((response: User[]) => response)
      );
  }

  /**
   * get the authenticated user
   *
   * @returns {Observable<R>}
   */
  getAuthenticatedUser(): Observable<User[]> {
    // get users from api
    return this.http.get(app.api_url + "/api/user").pipe(
      map((response: User[]) => response)
    );
  }

  /**
   * register this user
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {string} confirm
   * @returns {Observable<boolean>}
   */
  register(name: string, email: string, password: string, confirm: string): any {
    return this.http.post(app.api_url + "/api/register", {
      name: name, email: email, password: password, password_confirmation: confirm
    })
      .pipe(map((response: any) => {
        // register successful if there's a jwt token in the response
        let token = !!response && response.token;
        if (token) {
          // set token property
          this.token = token;
          this.userEvent.emit(response);
          let name = !!response.name ? response.name : "";
          let id = !!response.id ? response.id : 0;
          let currentUser = {id: id, name: name, email: email, token: token};
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          this.user = currentUser;
          this.authenticated = true;
          this.user.authenticated = true;
          this.userChange.emit(this.user);
          this.currentUserSubject$.next(currentUser);
          this.isLoggedIn$.next(!!this.token);
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          this.isLoggedIn$.next(false);
          return false;
        }
      }));
  }

  /**
   * logout fucking user
   */
  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem("currentUser");
    this.userChange.emit(null);
    this.currentUserSubject$.next(null);
    this.isLoggedIn$.next(false);
    console.log("info", "You are logged out!");
  }
}
