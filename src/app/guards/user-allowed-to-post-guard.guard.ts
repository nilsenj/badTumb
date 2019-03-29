import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from "../services/post.service";
import { Post } from "../models/Post";
import { Location } from "@angular/common";
import { map } from 'rxjs/operators';

@Injectable()
export class UserAllowedToPostGuardGuard implements CanActivate {
  public user;
  public authenticated;
  public id: number;
  public sub;
  public post: Post;

  constructor(public router: ActivatedRoute,
              public location: Location,
              public postService: PostService) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.token) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    this.user = user;
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.postService.findPost(next.params.id).pipe(
      map((data) => {
        this.post = data.post;
        if (this.user.email === this.post.user.email) {
          return true;
        }
        console.log("warning", "You are not allowed to perform this action!");
        return false;
      }, (error) => {
        console.log("warning", "You are not allowed to perform this action!");
        // not logged in so redirect to login page
        this.location.back();
        return false;
      })
    );
  }
}
