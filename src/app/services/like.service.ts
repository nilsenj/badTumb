import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Like } from "../models/Like";
import { app } from "../../config/app";
import { map } from 'rxjs/operators';

@Injectable()
export class LikeService {

  public token;

  constructor(@Inject(HttpClient) private http: HttpClient) {
  }

  /**
   * toggle like
   *
   * @param {Like} like
   * @returns {Observable<any>}
   */
  likeToggle(like: Like): Observable<any> {
    // get users from api
    return this.http.post(app.api_url + "/api/blog/likeToggle", like)
      .pipe(
        map((response: any) => response)
      );
  }

  /**
   * toggle like
   *
   * @param {Like} like
   * @returns {Observable<any>}
   */
  likesModelStatus(like: Like): Observable<any> {
    if (this.token) {
      // get users from api
      return this.http.get(app.api_url + "/api/blog/likesModelStatus?model=" + like.model + "&model_id=" + like.model_id)
        .pipe(
          map((response: any) => response)
        );
    } else {
      // get users from api
      return this.http.get(app.api_url + "/api/blog/likesModelStatus?model=" + like.model + "&model_id=" + like.model_id)
        .pipe(
          map((response: any) => response)
        );
    }
  }
}
