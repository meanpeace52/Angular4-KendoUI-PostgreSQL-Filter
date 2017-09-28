import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";

const api_url = "https://ma-server-crm-filters.herokuapp.com";

@Injectable()

export class HttpService {
  public companies: any[];
  public headers: Headers;

  constructor(
    private http:Http
  ) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  getCompanies () {
      return new Observable((observer) => {
        if(this.companies) {
          observer.next(this.companies);
          observer.complete();
        }
        else {
          this.http.get(api_url+'/api/company').subscribe(
            res => {
              this.companies = res.json();
              observer.next(this.companies);
              observer.complete();
            }, err => console.log(err)
          )
        }
      })
  }

  filterCompanies(params) {
    return this.http.post(api_url+'/api/company/filter', params, {headers: this.headers})
            .map(res => res.json())
  }
}
