import { Component, input } from '@angular/core';

@Component({
  selector: 'app-color-circle',
  templateUrl: './color-circle.html',
  styleUrl: './color-circle.scss',
})
export class ColorCircle {
  public color = input.required<string>();
}
