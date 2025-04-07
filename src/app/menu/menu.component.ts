import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { IntroduzioneComponent } from "../introduzione/introduzione.component";

@Component({
  selector: 'app-menu',
  imports: [HeaderComponent, IntroduzioneComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private router: Router){}

  navigateToProdotti(section: string){
    this.router.navigate(['/menu'], {fragment: section})
  }
}


