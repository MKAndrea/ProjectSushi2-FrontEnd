import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { Prodotto } from '../../modules/product';
import { CardCartComponent } from "../card-cart/card-cart.component";
import { Cart } from '../../modules/cart';
import { ApiService } from '../../services/api.service';
import { error } from 'console';
import { orderDTO } from '../../modules/orderDTO';
import { OrderDetails } from '../../modules/orderDetails';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { take } from 'rxjs';

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

  mapperForDTO(carrello: Prodotto[]): orderDTO {
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
    this.apiService.getProductCartt().subscribe(values => {
      values.forEach(value => {
        this.orderCart.push(value);
      })
    })
  }

  //Incrementa il counter presente nella scheda menu-component
  incrementCounter(cibo: Prodotto): void{
    this.menuService.incrementCounter(cibo);
    this.cdr.detectChanges()
    //this.counters[id]++;
  }

  decrementCounter(cibo: Prodotto): void{
    this.menuService.decrementCounter(cibo);
    this.cdr.detectChanges()
  }

    // sendOrderProva(): void {
    //   this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
    //     this.carrello.cart = value.cart;
    
    //     const ORDERDTO = this.mapperForDTO(this.carrello.cart);
    //     if (confirm(`Stai per inviare l'ordine sei sicuro?`)) {
    //       alert("Ordine inviato!");
    //       if(this.order.id){
    //         this.apiService.updateProductCartt(this.order.id!, ORDERDTO).subscribe(() => {
    //           this.carrello.cart.forEach(() => {
    //             this.menuService.resetCarrello()
    //           });
    //           this.carrello.cart = [];
    //         })
    //       }
    //       else{
    //         this.apiService.sendProductCartt(ORDERDTO).subscribe(() => {
    //           this.carrello.cart.forEach(() => {
    //             this.menuService.resetCarrello()
    //           });
    //           this.carrello.cart = [];
    //         });
    //       }
    //     }
    //   });
    // }

    sendOrder(): void {
      this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
        this.carrello.cart = value.cart;
    
        const ORDERDTO = this.mapperForDTO(this.carrello.cart);
        if (confirm(`Stai per inviare l'ordine sei sicuro?`)) {
          // if(this.orderCart.length > 0){
          //   this.apiService.updateProductCartt(this.order.id!, ORDERDTO).subscribe(() => {
          //     this.carrello.cart.forEach(() => {
          //       this.menuService.resetCarrello()
          //     });
          //     this.carrello.cart = [];
          //   })
          // }
            this.apiService.sendProductCartt(ORDERDTO).subscribe(() => {
              this.carrello.cart.forEach(() => {
                this.menuService.resetCarrello()
              });
              this.carrello.cart = [];
              alert("Ordine inviato!");
            });
        }
      });
    }

   removeCibo(cibo: Prodotto): void{
    this.menuService.removeCibo(cibo);
   }

   getPrezzoTotale(): void{
    this.totalPrice = 0;
    this.carrello.cart.forEach(prodotto => {
      this.totalPrice += prodotto.price! * prodotto.quantity!;
      })
   }
}
