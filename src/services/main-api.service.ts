import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainApiService {

  private url = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  //GET generale da modificare in base all'utilizzo
  generalGet(prefix: string) : Observable<any | any[]>{
    return this.http.get<any | any[]>(`${this.url}${prefix}`);
  }

  //POST generale da modificare in base all'utilizzo
  generalPost(prefix: string, body: any): Observable<any | any[]>{
    return this.http.post<any | any[]>(`${this.url}${prefix}`, body)
  }

  //DELETE generale da modificare in base all'utilizzo
  generalDelete(prefix: string): Observable<any | any[]>{
    return this.http.delete<any | any[]>(`${this.url}${prefix}`)
  }

  //PUT generale da modificare in base all'utilizzo
  generalPut(prefix: string, body: any): Observable<any>{
    return this.http.put<any>(`${this.url}${prefix}`, body)
  }
}
