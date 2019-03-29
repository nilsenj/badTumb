import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core";
import { Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { app } from "../../config/app";
import { AuthenticationService } from './authentication.service';

@Injectable()
export class FileUploadService {

  public token: string;

  constructor (@Inject(HttpClient) private http: HttpClient, @Inject(AuthenticationService) private auth: AuthenticationService) {
    const currentUser = this.auth.currentUserValue;
    this.token = currentUser && currentUser.token;
  }

  fileUpload (event, post): Observable<any> {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);
      formData.append("post_id", post.id);
      // get users from api
      return this.http.post(`${app.api_url}/api/blog/file/uploadFile`, formData)
        .pipe(map((response: any) => response));
    }
  }
}
