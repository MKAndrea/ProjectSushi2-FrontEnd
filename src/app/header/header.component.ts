import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  private counterSubscription: any;

  constructor(private router: Router, private menuService: MenuService){

  }

  generalCounter: number = 0;

  isLogged = false;

  ngOnInit(): void {
    //Aumenta il counter del carrello contenuto nell'header
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.generalCounter = 0;
      value.orderDetails.forEach(cibo => this.generalCounter += cibo.quantity!)
    })
    this.isLogged = this.menuService.getIslogged();
  }

  //Quando clicchi su un buttone ti porta ad un'altra pagina
  onClick(url: string): void{
    this.router.navigateByUrl(url);
  }
}
