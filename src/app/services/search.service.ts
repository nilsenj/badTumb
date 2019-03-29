import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs";
import { app } from "../../config/app";
import { map } from 'rxjs/operators';

@Injectable()
export class SearchService {
  constructor(@Inject(HttpClient) private http: HttpClient) {
  }

  public searchQuery(search: string): Observable<any> {
    // get users from api
    return this.http.get(app.api_url + "/api/blog/search?search=" + search)
      .pipe(
        map((response: any) => response)
      );
  }

  public requestAutocompleteItems(text: string): Observable<Response> {
    const url: string = app.api_url + "/search?search=" + text;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => response)
      );
  }
}
