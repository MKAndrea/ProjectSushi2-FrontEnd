import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { IntroduzioneComponent } from "../introduzione/introduzione.component";
import { ApiService } from '../api.service';
import { Cibo } from '../cibo';
import { TendinaComponent } from "../tendina/tendina.component";
import { EditDeleteService } from '../edit-delete.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [HeaderComponent, IntroduzioneComponent, TendinaComponent, FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  ciboArray: Cibo[] = [];
  isDropDownVisible = false;
  dropdownPosition = { top: '0px', left: '0px' };
  isReadOnly: boolean[] = [];
  solidBorder: string[] = [];
  border: string = "";
  isOpen = false;

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
    this.isReadOnly = this.ciboArray.map(() => true)
    this.solidBorder = this.ciboArray.map(() => "none")
  }

  constructor(private router: Router, private apiService: ApiService, private editDeleteService: EditDeleteService){}

  navigateToProdotti(section: string){
    this.router.navigate(['/menu'], {fragment: section})
  }

  showTendina(event: MouseEvent){
    this.editDeleteService.showTendina(event)
  }

  changeInput(index: number) {
    if(this.isReadOnly[index]){
      this.isReadOnly[index] = !this.isReadOnly[index];
      this.border = "1px solid black";
      this.solidBorder[index] = this.border;
    }
    else{
      this.isReadOnly[index] = !this.isReadOnly[index];
      this.border = "none";
      this.solidBorder[index] = this.border;
    }
  }

  toggleMEnu(){
    this.isOpen = !this.isOpen
  }
}


