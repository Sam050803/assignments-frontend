import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
// import { RouterLink, RouterOutlet } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
// import { Assignments } from "../assignments/assignments";

@Component({
  selector: 'app-navigation',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    // Assignments
],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation {
  isCompact = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Mode compact si la largeur de la sidebar est inférieure à 200px
    if (isPlatformBrowser(this.platformId)) {
      this.isCompact = event.target.innerWidth < 768;
    }
  }

  ngOnInit() {
    // Vérifier la taille initiale seulement côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.isCompact = window.innerWidth < 768;
    }
  }

  toggleCompact() {
    this.isCompact = !this.isCompact;
  }
}
