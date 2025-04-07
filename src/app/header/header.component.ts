import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { Cart } from '../cart';

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

  ngOnInit(): void {
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.generalCounter = 0;
      value.cart.forEach(cibo => this.generalCounter += cibo.quantity!)
    })
  }

  onClick(url: string){
    this.router.navigateByUrl(url);
  }
}
