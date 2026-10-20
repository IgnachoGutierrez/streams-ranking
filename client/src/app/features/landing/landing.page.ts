import { Component } from '@angular/core';
import { FeaturesComponent } from './components/features/features.component';
import { HeroComponent } from './components/hero/hero.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';

@Component({
  selector: 'app-landing-page',
  imports: [HeroComponent, FeaturesComponent, HowItWorksComponent],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage {}
