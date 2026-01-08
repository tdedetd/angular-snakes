import { Component, signal } from '@angular/core';
import { Canvas } from './components/canvas/canvas';

@Component({
  selector: 'app-root',
  imports: [Canvas],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-snakes');
}
