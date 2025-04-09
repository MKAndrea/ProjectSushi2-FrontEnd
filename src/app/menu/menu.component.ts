import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { IntroduzioneComponent } from "../introduzione/introduzione.component";
import { ApiService } from '../api.service';
import { Cibo } from '../cibo';
import { TendinaComponent } from "../tendina/tendina.component";
import { EditDeleteService } from '../edit-delete.service';

@Component({
  selector: 'app-menu',
  imports: [HeaderComponent, IntroduzioneComponent, TendinaComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  ciboArray: Cibo[] = [];
  isDropDownVisible = false;
  dropdownPosition = { top: '0px', left: '0px' };

  ngOnInit(): void {
    this.apiService.getProva().subscribe(prodottiCibo => {
      this.ciboArray = prodottiCibo;
    })
    this.editDeleteService.isDropdownVisible$.subscribe(visible => {
      this.isDropDownVisible = visible;
    });

    this.editDeleteService.dropdownPosition$.subscribe(position => {
      this.dropdownPosition = position;
    });
  }

  constructor(private router: Router, private apiService: ApiService, private editDeleteService: EditDeleteService){}

  navigateToProdotti(section: string){
    this.router.navigate(['/menu'], {fragment: section})
  }

  showTendina(event: MouseEvent){
    this.editDeleteService.showTendina(event)
  }
}


