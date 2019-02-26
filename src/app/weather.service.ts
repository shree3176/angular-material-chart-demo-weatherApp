import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  url = 'https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice';
  constructor(private _http: HttpClient) { 
  }
  
  weatherForecast(metric, region) {
    let constructedUrl = this.url+"/"+metric+"-"+region+".json";
    console.log(constructedUrl);
    return this._http.get(constructedUrl)
      .pipe(map(result => result));
  }

}
