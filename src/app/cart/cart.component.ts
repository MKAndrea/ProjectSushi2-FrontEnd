import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { CardCartComponent } from "../card-cart/card-cart.component";
import { Cart } from '../../modules/cart';
import { ApiService } from '../../services/api.service';
import { order } from '../../modules/order';
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
export class CartComponent implements OnInit {

  constructor(
    private menuService: MenuService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  counters: number[] = [];

  carrelloSubject: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({ cart: [] });
  carrello: Cart = { cart: [] };

  orderCart: order[] = [];

  order: order = {
    orderDetails: []
  }

  totalPrice: number = 0;

  ngOnInit(): void {
    // Riceve i dati per il carrello
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      console.log('Dati del carrello ricevuti:', value);
      this.carrello.cart = value.cart;
      console.log(this.carrello.cart);
      this.getPrezzoTotale();
    }, error => {
      alert("I prodotti nel carrello non sono stati inviati correttamente");
    });

    // Visualizza tutti gli elementi contenuti nel carrello
    this.apiService.getProductCartt().subscribe(values => {
      values.forEach(value => {
        this.orderCart.push(value);
      });
      this.orderCart = [...this.orderCart];
    }, error => {
      alert("I prodotti nel carrello non sono stati caricati correttamente");
    });
  }

  // Incrementa il counter presente nella scheda menu-component
  incrementCounter(orderDetail: OrderDetails): void {
    this.menuService.incrementCounter(orderDetail.product);
    this.cdr.detectChanges();
  }

  decrementCounter(orderDetail: OrderDetails): void {
    this.menuService.decrementCounter(orderDetail.product);
    this.cdr.detectChanges();
  }

  sendOrderProva(): void {
    this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
      this.carrello.cart = value.cart;

      const ORDERDTO: order = {
        orderDetails: this.carrello.cart
      };

      if (confirm(`Stai per inviare l'ordine, sei sicuro?`)) {
        this.apiService.sendProductCartt(ORDERDTO).subscribe((response: any) => {
          // Aggiorna ORDERDTO con l'id e gli orderDetails restituiti dal backend
          ORDERDTO.id = response.id;
          ORDERDTO.orderDetails = response.orderDetails;

          this.orderCart.push(ORDERDTO);

          // Reset del carrello
          this.menuService.resetCarrello();
          this.carrello.cart = [];

          console.log(this.orderCart);
          alert("Ordine inviato!");
        }, error => {
          console.error("Errore nell'invio dell'ordine", error);
          alert("Si è verificato un errore nell'invio dell'ordine. Riprova!");
        });
      }
    });
  }

  // Invia l'ordine appena premi il pulsante send order
  sendOrder(): void {
    this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
      this.carrello.cart = value.cart;

      const ORDERDTO: order = {
        orderDetails: this.carrello.cart
      };

      if (confirm(`Stai per inviare l'ordine sei sicuro?`)) {
        this.apiService.sendProductCartt(ORDERDTO).subscribe(() => {
          this.menuService.resetCarrello();
          this.carrello.cart = [];
          alert("Ordine inviato!");
          this.apiService.getProductCartt().subscribe(ordini => {
            this.orderCart = ordini;
          });
        }, error => {
          alert("Ordine non inviato correttamente. Riprova.");
        });
      }
    }, error => {
      alert("I prodotti non sono stati caricati correttamente");
    });
  }

  // Rimuovi il prodotto dal carrello
  removeCibo(cibo: OrderDetails): void {
    this.menuService.removeCibo(cibo);
  }

  // Somma del prezzo totale dei prodotti contenuti nel carrello
  getPrezzoTotale(): void {
    this.totalPrice = 0;
    this.carrello.cart.forEach(dettaglio => {
      this.totalPrice += dettaglio.product.price! * dettaglio.quantity!;
    });
  }
}
