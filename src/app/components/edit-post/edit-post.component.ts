import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Post } from "../../models/Post";
import { PostService } from "../../services/post.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FileUploadService } from "../../services/file-upload.service";
import { Observable } from "rxjs";
import { app } from "../../../config/app";
import { map } from 'rxjs/operators';

@Component({
  selector: "app-edit-post",
  templateUrl: "./edit-post.component.html",
  styleUrls: ["./edit-post.component.scss"]
})
export class EditPostComponent implements OnInit {

  public post: Post;
  @Input() public postForm: FormGroup;
  public canSavePost = false;
  public loading = false;
  public emitter = new EventEmitter();
  public toggles = [{value: true, display: "Available"}, {value: false, display: "Not Available"},];
  public sub: any;
  public id: number;
  public authenticated = false;
  public user = {};
  public showDebug = false;
  public fileEvent;
  public tmpFileSrc: string | ArrayBuffer = null;
  public postLoaded = false;

  constructor(public postBuilder: FormBuilder, public postService: PostService, public route: Router,
              public router: ActivatedRoute, public fileUpload: FileUploadService, private http: HttpClient) {

    this.sub = this.router.params.subscribe(params => {
      this.id = +params['id'];
    });
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.token) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    this.user = user;
  }

  ngOnInit(): void {
    this.findPost(this.id);

    this.emitter.subscribe((data) => {
      this.createForm();
      if (this.postForm.valid) {
        this.canSavePost = true;
      } else {
        this.canSavePost = false;
      }
      this.postLoaded = true;
    });
  }

  public onChange(): void {
  }

  public onReady(): void {
  }

  public onFocus(): void {
  }

  public onBlur(): void {
  }

  public getDisplayToggles(): string {
    if (this.post.available) {
      return this.toggles[0].display;
    } else {
      return this.toggles[1].display;
    }
  }

  public updatePost(form: any): void {
    this.loading = true;
    if (!this.postForm.valid) {
      console.log("error", "Form not valid! Try once more");
    } else {
      this.postService.updatePost(this.post).subscribe((response) => {
        if (this.fileEvent) {
          this.fileUpload.fileUpload(this.fileEvent, this.post)
            .subscribe(data => {
              console.log("success", "Your Post Has been saved!");
              this.route.navigate(["/posts/", response.post.id]);
            }, error => {
              console.log("error", "Sorry! Your Post image has been updated!");
              this.route.navigate(["/posts/update/", response.post.id]);
              console.log(error);
            });
        } else {
          console.log("success", "Your Post Has been saved!");
          this.route.navigate(["/posts/", response.post.id]);
        }
      }, (error) => {
        console.log(error);
        console.log("error", "Code: " + error.status + "! Error during post update!" + "Reason: " + error.statusText);
      });
    }
    this.loading = false;
  }

  private createForm(): void {
    this.postForm = this.postBuilder.group({
      name: [this.post.name, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      preamble: [this.post.preamble, [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      body: [this.post.body, [Validators.required, Validators.minLength(120), Validators.maxLength(50000)]],
      tagged: [this.post.tagged, []],
      available: ["", Validators.required],
    });
  }

  public fileChange(event): void {
    this.fileEvent = event;
    this.readInput();
  }

  public readInput(): void {
    const input = this.fileEvent;
    if (input.target.files && input.target.files[0]) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(input.target.files[0]);
      reader.onload = () => {
        this.tmpFileSrc = reader.result;
      };
    }
  }

  public findPost(id: number): void {
    this.postService.findPost(id).subscribe((data) => {
      this.post = data.post;
      this.post.available = data.post.available ? true : false;
      this.emitter.emit("received");
    });
  }

  public requestAutocompleteItems(text: string): Observable<Response> {
    const url = app.api_url + `/tagsPostSearch?q=${text}`;
    return this.http
      .get(url)
      .pipe(
        map((data: Response): any => {
          data.json();
        })
      );
  };
}
