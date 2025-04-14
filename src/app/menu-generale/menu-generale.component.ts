import { Component, numberAttribute, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Cibo } from '../../modules/product';
import { Cart } from '../../modules/cart';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-generale',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './menu-generale.component.html',
  styleUrl: './menu-generale.component.css'
})
export class MenuGeneraleComponent implements OnInit, OnDestroy{

  constructor(private menuService: MenuService, private route: ActivatedRoute, private apiService: ApiService){}

  ciboArray: Cibo[] = [];
  bevandaArray: Cibo[] = [];
  dolceArray: Cibo[] = [];
  counters: number[] = [];
  carrello: Cart = {cart: []}

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
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.carrello.cart = value.cart;
      this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
    })
    this.apiService.getProductCibo().subscribe(prodotti => {
      this.ciboArray = prodotti;
      this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
    })
    this.apiService.getProductBevande().subscribe(prodotti =>{
      this.bevandaArray = prodotti;
      this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)

    })
    this.apiService.getProductDolci().subscribe(prodotti =>{
      this.dolceArray = prodotti;
      this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
    })
  }

  incrementCounter(cibo: Cibo): void{
    this.menuService.incrementCounter(cibo);
    //this.counters[id]++;
  }

  decrementCounter(cibo: Cibo): void{
    this.menuService.decrementCounter(cibo);
  }

  deleteProduct(id: number): void{
    this.apiService.deleteProductById(`http://localhost:8080/product/${id}`).subscribe(() =>{
      this.apiService.getProductDolci().subscribe(prodotti =>{
        this.dolceArray = prodotti;
        this.dolceArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      })
      this.apiService.getProductBevande().subscribe(prodotti =>{
        this.bevandaArray = prodotti;
        this.bevandaArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      })
      this.apiService.getProductCibo().subscribe(prodotti =>{
        this.ciboArray = prodotti;
        this.ciboArray.forEach(elem => elem.quantity = this.carrello.cart.find(cibo => cibo.name == elem.name)?.quantity || 0)
      })
    })
  }

  ngOnDestroy(){
    this.menuService.getCarrelloAsObservable().subscribe()
  }

}
