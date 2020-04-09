import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions,Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getStats(){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    //let body={Country:data};
    return this.http.get('/api/v1/covid_all', options )
    .pipe(map((res: Response) => res.json()));
  }

  getTNStats(){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });    
    return this.http.get('/api/v1/covid_TN', options )
    .pipe(map((res: Response) => res.json()));
  }


  constructor(private http: Http) { }
}
