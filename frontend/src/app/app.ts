import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Weather } from './weather';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
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
