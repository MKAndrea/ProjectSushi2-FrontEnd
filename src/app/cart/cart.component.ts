import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { Cibo } from '../../modules/product';
import { CardCartComponent } from "../card-cart/card-cart.component";
import { Cart } from '../../modules/cart';
import { ApiService } from '../../services/api.service';
import { error } from 'console';
import { orderDTO } from '../../modules/orderDTO';
import { orderDetailsDTO } from '../../modules/orderDetailsDTO';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { take } from 'rxjs';
import { CiboDTO } from '../../modules/ciboDTO';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, FooterComponent, CardCartComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  constructor(private menuService: MenuService, private apiService: ApiService, private cdr: ChangeDetectorRef){

  }
  counters: number[] = [];

  carrelloSubject: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({cart: []})
  carrello: Cart = {cart: []};

  orderCart: orderDTO[] = [];

  order: orderDTO = {
    orderDetails: []
  }

  mapperForDTO(carrello: Cibo[]): orderDTO {
    this.order = {
      orderDetails: carrello.map(cibo => ({
        quantity: cibo.quantity!,
        product: {
          id: cibo.id!,
          name: cibo.name!,
          ingredients: cibo.ingredients!,
          description: cibo.description!,
          price: cibo.price!,
          productImage: cibo.productImage!,
          category: cibo.category!
        }
      }))
    };
    return this.order;
  }


  totalPrice: number = 0;

  ngOnInit(): void {
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      console.log('Dati del carrello ricevuti:', value);
      this.carrello.cart = value.cart;
      console.log(this.carrello.cart)
      this.getPrezzoTotale();
    })
    this.apiService.getProductCart().subscribe(values => {
      values.forEach(value => {
        this.orderCart.push(value);
      })
    })
  }

  //Incrementa il counter presente nella scheda menu-component
  incrementCounter(cibo: Cibo): void{
    this.menuService.incrementCounter(cibo);
    this.cdr.detectChanges()
    //this.counters[id]++;
  }

  decrementCounter(cibo: Cibo): void{
    this.menuService.decrementCounter(cibo);
    this.cdr.detectChanges()
  }

    sendOrder(): void {
      this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
        this.carrello.cart = value.cart;
    
        const ORDERDTO = this.mapperForDTO(this.carrello.cart);
        if (confirm(`Stai per inviare l'ordine sei sicuro?`)) {
          this.apiService.sendProductCart(ORDERDTO).subscribe(() => {
            alert("Ordine inviato!");
            this.carrello.cart.forEach(() => {
              this.menuService.resetCarrello()
            });
            this.carrello.cart = [];
          });
        }
      });
    }

   removeCibo(cibo: Cibo): void{
    this.menuService.removeCibo(cibo);
   }

   getPrezzoTotale(): void{
    this.totalPrice = 0;
    this.carrello.cart.forEach(prodotto => {
      this.totalPrice += prodotto.price! * prodotto.quantity!;
      })
   }
}
