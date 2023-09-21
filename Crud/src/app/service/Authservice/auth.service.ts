import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    return this.http.post<{ data: { token: string } }>('http://localhost:8000/login', { username, password }).pipe(
      map(response => {
        if (response.data.token) {
          console.log("Login successful!");
          // Save the token in localStorage
          localStorage.setItem('token', response.data.token);
        } else {
          console.error("Login failed!");
        }
        return response;
      }),
      catchError(error => {
        console.error("error:", error);
        throw error; 
      })
    );
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}