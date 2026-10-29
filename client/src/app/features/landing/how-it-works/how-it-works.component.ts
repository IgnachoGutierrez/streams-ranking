import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

interface Step {
  label: string;
  /** Text appended to the label as a link to the Spotify login. */
  loginLink?: string;
  text: string;
}

const STEPS: readonly Step[] = [
  { label: 'Presioná ', loginLink: 'Ver mi ranking', text: 'Te llevamos a la página oficial de Spotify.' },
  {
    label: 'Ingresá con tu cuenta',
    text: 'Spotify te pide permiso para ver tu actividad. Nunca vemos tu contraseña.',
  },
  {
    label: 'Mirá los resultados',
    text: 'Tus artistas y canciones más escuchados del último mes, seis meses o de siempre.',
  },
];

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  protected readonly steps = STEPS;
  protected readonly loginUrl = `${environment.apiUrl}/auth/login`;
}
