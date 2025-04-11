import { Component, numberAttribute, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Cibo } from '../ProductDTO';
import { CartService } from '../../services/cart.service';
import { Cart } from '../cart';
import { ActivatedRoute } from '@angular/router';
import { Bevanda } from '../bevanda';
import { Dolce } from '../dolci';
import { ApiService } from '../../services/api.service';
import { Prodotti } from '../prodotti';
import { CiboDTO } from '../../ciboDTO';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-generale',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './menu-generale.component.html',
  styleUrl: './menu-generale.component.css'
})
export class MenuGeneraleComponent implements OnInit, OnDestroy{

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
    // this.bevandaArray = this.menuService.getBevandaArray();
    // this.dolceArray = this.menuService.getDolceArray();
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.carrello.cart = value.cart;
      this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
    })
    this.apiService.getProdotto("http://localhost:8080/product/category/Cibo").subscribe(prodotti => {
      this.ciboArray = prodotti;
      this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
    })
    this.apiService.getProdotto("http://localhost:8080/product/category/Bevande").subscribe(prodotti =>{
      this.bevandaArray = prodotti;
      this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)

    })
    this.apiService.getProdotto("http://localhost:8080/product/category/Dolci").subscribe(prodotti =>{
      this.dolceArray = prodotti;
      this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
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

  // prodotti: CiboDTO[] = this.mapDtoCibo(this.ciboArray)

  // mapDtoCibo(ciboArray: Cibo[]): CiboDTO[]{
  //   if(ciboArray.length > 0) {
  //     let ciboToBeSanitize = ciboArray.map(value => ({
  //       name: value.name ??  '',
  //       immagine: value.immagine?? '',
  //       price: value.price?? 0
  //     }))
  //     ciboToBeSanitize.forEach((elem) => {
  //       if ((Object.values(elem) == null) || (Object.values(elem) == undefined)) {
  //         //delete elem.
  //       }
  //     })
  //     return [];
  //     //TODO return ciboToBeSanitize
  //   }
  //   else return []
  // }

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

  deleteProduct(id: number){
    this.apiService.deleteProductById(`http://localhost:8080/product/${id}`).subscribe(() =>{
      this.apiService.getProdotto("http://localhost:8080/product/category/Dolci").subscribe(prodotti =>{
        this.dolceArray = prodotti;
        this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      })
      this.apiService.getProdotto("http://localhost:8080/product/category/Bevande").subscribe(prodotti =>{
        this.bevandaArray = prodotti;
        this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      })
      this.apiService.getProdotto("http://localhost:8080/product/category/Cibo").subscribe(prodotti =>{
        this.ciboArray = prodotti;
        this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      })
    })
  }

  ngOnDestroy(){
    this.menuService.getCarrelloAsObservable().subscribe()
  }

}
