import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/Authservice/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponent } from '../shared/conformModal.component';
import { ApiService } from '../service/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private AuthService: AuthService,
    private ApiService:ApiService,
    private modalService: NgbModal
  ) {}
  ngOnInit():void {
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password:['',Validators.required] 
    });
  }   
  userLogin() {
    this.AuthService.login(
      this.loginForm.value.username,
      this.loginForm.value.password
    ).subscribe(
      (user: any) => {
        if (user) {
          console.log(user);
          const loginModal = this.modalService.open(SharedComponent);
          loginModal.componentInstance.login = 'Login Successful';
          loginModal.result.then((result) => {
            if (result === true) { 
              localStorage.setItem('loggedUser', JSON.stringify(user));
              // localStorage.setItem('loggedUser',user.name);
              this.router.navigate(['']);
            }
          });
        } else {
          // If authentication failed, show an error message.
          const loginModal = this.modalService.open(SharedComponent);
          loginModal.componentInstance.login = 'or Password incorrect';
        }
      },
      (err: any) => {
        console.log("",err)
        alert('Something went wrong');
      }
    );  
  }
}
