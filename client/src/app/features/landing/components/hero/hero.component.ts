import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RankingCtaComponent } from '../../../../shared/ranking-cta/ranking-cta.component';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, RankingCtaComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {}
