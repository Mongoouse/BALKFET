import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, NgIf, NgForOf } from '@angular/common';
import { Weather } from './weather';

@Component({
  selector: 'app-root',
  imports: [DatePipe, NgIf, NgForOf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = signal('alkfejl');
  weatherData: any[] = [];

  constructor(private weatherService: Weather) {}

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.weatherService.getWeather().subscribe(data => {
      this.weatherData = data;
    });
  }
}
