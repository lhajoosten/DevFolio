import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'devfolio-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'Lucas Hajoosten - Portfolio';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service initializes automatically
  }
}
