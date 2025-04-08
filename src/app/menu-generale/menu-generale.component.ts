import { Component, numberAttribute, OnInit, AfterViewChecked } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { MenuService } from '../menu.service';
import { Cibo } from '../cibo';
import { CartService } from '../cart.service';
import { Cart } from '../cart';
import { ActivatedRoute } from '@angular/router';
import { Bevanda } from '../bevanda';
import { Dolce } from '../dolci';
import { ApiService } from '../api.service';
import { Prodotti } from '../prodotti';

@Component({
  selector: 'app-menu-generale',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './menu-generale.component.html',
  styleUrl: './menu-generale.component.css'
})
export class MenuGeneraleComponent implements OnInit{

  constructor(private menuService: MenuService, private cartService: CartService, private route: ActivatedRoute, private apiService: ApiService){}

  ciboArray: Cibo[] = [];
  bevandaArray: Bevanda[] = [];
  dolceArray: Dolce[] = [];
  counters: number[] = [];
  carrello: Cart = {cart: [], prodotti: []}

  arrayCibiProva: Prodotti= {
    cibo: this.ciboArray,
    bevanda: this.bevandaArray,
    dolce: this.dolceArray
  };

  private counterSubscription: any;

  ngAfterViewChecked(){
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  ngOnInit(){
    //this.ciboArray = this.menuService.getCiboArray();
    this.bevandaArray = this.menuService.getBevandaArray();
    this.dolceArray = this.menuService.getDolceArray();
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.carrello.cart = value.cart;
      this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
    })
    this.apiService.getProva().subscribe(prodottiCibo => {
      this.ciboArray = prodottiCibo;
    })

    // this.apiService.getProva().subscribe(prodottiCibo => {
    //   prodottiCibo.map(elemento => {
    //     switch(elemento.category){
    //       case "Cibo":
    //         return this.ciboArray.push(elemento)
    //         break;
    //       case "Bevanda":
    //         return this.bevandaArray.push(elemento)
    //         break;
    //       case "Dolci":
    //         return this.dolceArray.push(elemento)
    //         break;
    //       default:
    //         return true;
    //     }
    //   })
    // })
    // this.counterSubscription = this.menuService.getCountersObservable().subscribe(value => {
    //   this.counters = value;
    // });
  }


  // removeCibo(id: number){
  //   this.cartService.removeCart(id);
  //   this.menuService.resetCounterProdotto(id);
  // }

  // addCibo(cibo: Cibo, id: number){
  //   if(this.counters[id] == 0){
  //     this.menuService.incrementCounter(id);
  //     this.cartService.addCart(cibo, id);
  //     this.menuService.getGeneralCounter();
  //   }
  //   else{
  //     this.cartService.addCart(cibo, id)
  //     console.log(cibo);
  //     this.menuService.getGeneralCounter();
  //   }
  // }

  incrementCounter(cibo: Cibo){
    this.menuService.incrementCounter(cibo);
    //this.counters[id]++;
  }

  /*incrementCounter2(bevanda: Bevanda){
    this.menuService.incrementCounter(bevanda);
    //this.counters[id]++;
  }*/

  /*incrementCounter3(dolce: Dolce){
    this.menuService.incrementCounter3(dolce);
    //this.counters[id]++;
  }*/

  incrementCounterProdotti(prodotti: Prodotti, id: number){
    this.menuService.incrementCounterProdotti(prodotti, id);
  }

  decrementCounter(cibo: Cibo){
    this.menuService.decrementCounter(cibo);
  }

  decrementCounter2(bevanda: Bevanda){
    this.menuService.decrementCounter2(bevanda);
  }

  decrementCounter3(dolce: Dolce){
    this.menuService.decrementCounter3(dolce);
  }

}
