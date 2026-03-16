import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private apiUrl = 'http://localhost:5000/WeatherForecast';

  constructor(private http: HttpClient) {}

  getWeather(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
