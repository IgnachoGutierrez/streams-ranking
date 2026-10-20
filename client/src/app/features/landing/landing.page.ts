import { Component } from '@angular/core';
import { FeaturesComponent } from './components/features/features.component';
import { HeroComponent } from './components/hero/hero.component';

@Component({
  selector: 'app-landing-page',
  imports: [HeroComponent, FeaturesComponent],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage {}
