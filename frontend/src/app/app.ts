import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Weather } from './weather';
import { BooksComponent } from './books.component';

@Component({
  selector: 'app-root',
  imports: [DatePipe, NgIf, NgForOf, BooksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = signal('alkfejl');
  weatherData = signal<any[]>([]);

  constructor(private weatherService: Weather) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.weatherService.getWeather().subscribe({
      next: (data) => {
        this.weatherData.set(data);
      },
      error: (error) => console.error('Error loading weather:', error)
    });
  }
}
