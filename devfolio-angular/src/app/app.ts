import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'devfolio-root',
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'Luc Joosten - Portfolio';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service initializes automatically
  }
}
