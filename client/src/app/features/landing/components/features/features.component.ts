import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/** Spotify logo, from Simple Icons (CC0). */
const SPOTIFY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;

interface Feature {
  icon: string;
  title: string;
  text: string;
}

const FEATURES: readonly Feature[] = [
  {
    icon: 'format_list_numbered',
    title: 'Top artistas + canciones',
    text: 'Dos rankings actualizados de hasta 50 artistas o canciones más escuchados en tu Spotify, con miniaturas de álbumes e imágenes de los artistas para que compartas en tus redes sociales.',
  },
  {
    icon: 'filter_list',
    title: 'Rankings por tiempo',
    text: 'Ambos rankings pueden filtrarse por el período de tiempo que quieras. Hay resultados de todos los tiempos, seis meses o cuatro semanas.',
  },
  {
    icon: 'lock',
    title: 'Seguridad garantizada',
    text: 'No guardamos ningún tipo de información personal de tu usuario o contraseña. La autorización de acceso a las estadísticas se realiza sólo desde la página web oficial de Spotify.',
  },
];

@Component({
  selector: 'app-features',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  protected readonly features = FEATURES;

  constructor() {
    inject(MatIconRegistry).addSvgIconLiteral(
      'spotify',
      inject(DomSanitizer).bypassSecurityTrustHtml(SPOTIFY_SVG),
    );
  }
}
