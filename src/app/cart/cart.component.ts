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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, FooterComponent, CardCartComponent, FormsModule],
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

  isEditing: boolean = false;

  totalPrice: number = 0;

  ngOnInit(): void {
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

  // Invia l'ordine appena premi il pulsante send order
  sendOrderProva(): void {
    this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
      this.carrello.cart = value.cart;

      const ORDERDTO: order = {
        orderDetails: this.carrello.cart
      };

      if (confirm(`Stai per inviare l'ordine, sei sicuro?`)) {
        this.apiService.sendProductCartt(ORDERDTO).subscribe((response: any) => {
          ORDERDTO.id = response.id;
          ORDERDTO.orderDetails = response.orderDetails;
          this.orderCart.push(ORDERDTO);
          this.menuService.resetCarrello();
          this.carrello.cart = [];
          console.log(this.orderCart);
          alert("Ordine inviato!");
        }, error => {
          alert("Si è verificato un errore")
        });
      }
    });
  }
  // modificaOrdine(orderDaModificare: order): void {

  //   this.carrello.cart = [...orderDaModificare.orderDetails];
  
  //   this.menuService.setCarrello({ cart: [...orderDaModificare.orderDetails] });
  
  //   if (orderDaModificare.id) {
  //     this.apiService.updateProductCartt(orderDaModificare.id, {
  //       id: orderDaModificare.id,     
  //       orderDetails: this.carrello.cart
  //     }).subscribe(() =>{
  //         this.getPrezzoTotale();
  //       },
  //       error => {
  //         alert("non ha aggiunto i prodotti correttamente al carrello, riprova")
  //       }
  //     );
  //   } else {
  //     alert("Errore, l'id non è specificato");
  //   }
  //   console.log(this.carrello.cart);
  //   this.isEditing = true;
  // }

  modificaOrdine(orderDaModificare: order): void {
    this.carrello.cart = [...orderDaModificare.orderDetails];
    this.menuService.setCarrello({ cart: [...orderDaModificare.orderDetails] });
    this.getPrezzoTotale();
    this.isEditing = true;
    this.order = orderDaModificare;
    console.log('Modalità modifica attiva. Carrello aggiornato con ordine esistente:', this.carrello.cart);
  }
  
  

  orderUpdate(orderDaModificare: order): void {
    // Filtra solo i prodotti con quantità maggiore di 0
    const prodottiValidi = this.carrello.cart.filter(item => item.quantity > 0);
  
    this.menuService.setCarrello({ cart: prodottiValidi });
  
    if (orderDaModificare.id) {
      const ordineAggiornato: order = {
        id: orderDaModificare.id,
        orderDetails: prodottiValidi
      };
  
      this.apiService.updateProductCartt(orderDaModificare.id, ordineAggiornato)
        .subscribe(() => {
          this.getPrezzoTotale();
  
          const index = this.orderCart.findIndex(o => o.id === ordineAggiornato.id);
          if (index !== -1) {
            this.orderCart[index] = { ...ordineAggiornato };
  
            this.orderCart[index].orderDetails = prodottiValidi;
  
            this.orderCart = [...this.orderCart];
          }
  
          alert("Ordine modificato con successo!");
        }, error => {
          alert("Errore durante l'aggiornamento dell'ordine.");
        });
  
    } else {
      alert("Errore: ID ordine mancante.");
    }
  
    this.menuService.resetCarrello();
    this.carrello.cart = [];
    this.isEditing = false;
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

  // sendOrder(): void {
  //   this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
  //     this.carrello.cart = value.cart;

  //     const ORDERDTO: order = {
  //       orderDetails: this.carrello.cart
  //     };

  //     if (confirm(`Stai per inviare l'ordine sei sicuro?`)) {
  //       this.apiService.sendProductCartt(ORDERDTO).subscribe(() => {
  //         this.menuService.resetCarrello();
  //         this.carrello.cart = [];
  //         alert("Ordine inviato!");
  //         this.apiService.getProductCartt().subscribe(ordini => {
  //           this.orderCart = ordini;
  //         });
  //       }, error => {
  //         alert("Ordine non inviato correttamente. Riprova.");
  //       });
  //     }
  //   }, error => {
  //     alert("I prodotti non sono stati caricati correttamente");
  //   });
  // }