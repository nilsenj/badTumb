import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Post } from "../models/Post";
import { app } from "../../config/app";
import { map } from 'rxjs/operators';


@Injectable()
export class PostService {
  public token;

  constructor(@Inject(HttpClient) private http: HttpClient) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.token = currentUser && currentUser.token;
  }

  /**
   * get all users
   *
   * @returns {Observable<R>}
   */
  getPosts(page?: number): Observable<any> {
    if (this.token) {
      // get users from api
      return this.http.get(app.api_url + "/api/blog/index?page=" + page)
        .pipe(
          map((response: any) => response)
        );
    }
    // get users from api
    return this.http.get(app.api_url + "/api/blog/index?page=" + page)
      .pipe(
        map((response: any) => response)
      );
  }

  /**
   * get all users
   *
   * @returns {Observable<R>}
   */
  findPost(id: number): Observable<any> {
    if (this.token) {
      // get users from api
      return this.http.get(app.api_url + "/api/blog/" + id)
        .pipe(
          map((response: any) => response)
        );
    }
    return this.http.get(app.api_url + "/api/blog/" + id)
      .pipe(
        map((response: any) => response)
      );
  }

  /**
   * get personal posts
   *
   * @param {number} page
   * @returns {Observable<any>}
   */
  getPersonalPosts(page?: number): Observable<any> {
    // get users from api
    return this.http.get(app.api_url + "/api/blog/personal?page=" + page)
      .pipe(
        map((response: any) => response)
      );
  }

  /**
   * save the post
   *
   * @param {Post} post
   * @returns {Observable<any>}
   */
  savePost(post: Post): Observable<any> {
    // get users from api
    return this.http.post(app.api_url + "/api/blog/store", post)
      .pipe(
        map((response: any) => response)
      );
  }

  updatePost(post: Post): Observable<any> {
    // get users from api
    return this.http.put(app.api_url + "/api/blog/update/" + post.id, post)
      .pipe(
        map((response: any) => response)
      );
  }

  /**
   * delete the post
   *
   * @param {number} id
   * @returns {Observable<any>}
   */
  deletePost(id: number): Observable<any> {
    // get users from api
    return this.http.delete(app.api_url + "/api/blog/" + id)
      .pipe(
        map((response: any) => response)
      );
  }
}
