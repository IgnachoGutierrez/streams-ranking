import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { HighlightsComponent } from './highlights/highlights.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';

@Component({
  selector: 'app-landing-page',
  imports: [HeroComponent, HighlightsComponent, HowItWorksComponent],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage {}
