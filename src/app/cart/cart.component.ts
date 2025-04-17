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
import { StorageService } from '../../services/storage.service';
import { TendinaComponent } from "../tendina/tendina.component";
import { OrderHistoryComponent } from "../order-history/order-history.component";
import { routes } from '../app.routes';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, FooterComponent, CardCartComponent, FormsModule, TendinaComponent, OrderHistoryComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private menuService: MenuService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  counters: number[] = [];

  carrelloSubject: BehaviorSubject<order> = new BehaviorSubject<order>({ orderDetails: [] });
  ordineInModificaId: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  carrello: order = { orderDetails: [] };

  orderCart: order[] = [];

  order: order = {
    orderDetails: []
  }

  isEditing: boolean = false;

  totalPrice: number = 0;

  ngOnInit(): void {

    this.menuService.isEditing$.subscribe(isEditing => {
      this.isEditing = isEditing;
      this.cdr.detectChanges();  // Assicurati che il cambiamento venga rilevato
    });
    
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      console.log('Dati del carrello ricevuti:', value);
      this.carrello.orderDetails = value.orderDetails;
      console.log(this.carrello.orderDetails);
      this.getTotalPrice();
    }, error => {
      alert("I prodotti nel carrello non sono stati inviati correttamente");
    });

    // Visualizza tutti gli elementi contenuti nel carrello
    this.apiService.getProductCart().subscribe(values => {
      values.forEach(value => {
        this.orderCart.push(value);
      });
      this.orderCart = [...this.orderCart];
    }, error => {
      alert("I prodotti nel carrello non sono stati caricati correttamente");
    });

    const savedId = this.storageService.getItem('ordineInModificaId');
    if (savedId) {
      this.ordineInModificaId.next(Number(savedId));
    }
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
  sendOrder(): void {
    this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
      this.carrello.orderDetails = value.orderDetails;

      const ORDERDTO: order = {
        orderDetails: this.carrello.orderDetails
      };

      if (confirm(`Stai per inviare l'ordine, sei sicuro?`)) {
        this.apiService.sendProductCart(ORDERDTO).subscribe((response: any) => {
          ORDERDTO.id = response.id;
          ORDERDTO.orderDetails = response.orderDetails;
          this.orderCart.push(ORDERDTO);
          this.menuService.resetCart();
          this.carrello.orderDetails = [];
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

  editOrder(orderDaModificare: order): void {
    this.carrello.orderDetails = [...orderDaModificare.orderDetails];
    this.menuService.setCart({ orderDetails: [...orderDaModificare.orderDetails] });
    this.getTotalPrice();
  
    this.isEditing= true;
  
    this.ordineInModificaId.next(orderDaModificare.id ?? null);
    this.storageService.setItem('ordineInModificaId', String(orderDaModificare.id));
  
    console.log('Modalità modifica attiva. Carrello aggiornato con ordine esistente:', this.carrello.orderDetails);
  }
  
  
  navigateToShowOrder(){
    this.router.navigate(['/order-history'])
  }
  

  orderUpdate(): void {
    const idOrdine = this.ordineInModificaId.value;
  
    if (!idOrdine) {
      alert("Errore: ID ordine mancante.");
      return;
    }
  
    const prodottiValidi = this.carrello.orderDetails.filter(item => item.quantity > 0);
    const ordineAggiornato: order = {
      id: idOrdine,
      orderDetails: prodottiValidi
    };
  
    this.apiService.updateProductCart(idOrdine, ordineAggiornato)
      .subscribe(() => {
        this.getTotalPrice();
        const index = this.orderCart.findIndex(o => o.id === idOrdine);
        if (index !== -1) {
          this.orderCart[index] = ordineAggiornato;
          this.orderCart = [...this.orderCart];
        }
        alert("Ordine modificato con successo!");
      }, error => {
        alert("Errore durante l'aggiornamento dell'ordine.");
      });
  
    this.menuService.resetCart();
    this.carrello.orderDetails = [];
    this.isEditing = false;
    this.menuService.setIsEditing(false);
    this.ordineInModificaId.next(null); // pulisci ID dopo modifica
  }
  
  
  deleteOrder(id: number) {
    if (!confirm("Sei sicuro di voler eliminare questo ordine?")) return;
  
    this.apiService.deleteOrder(id).subscribe({
      next: () => {
        this.orderCart = this.orderCart.filter(order => order.id !== id);
        alert("Ordine eliminato con successo");
      },
      error: (err) => {
        console.error('Errore durante l\'eliminazione dell\'ordine:', err);
      }
    });
  }
  

  // Rimuovi il prodotto dal carrello
  removeProduct(product: OrderDetails): void {
    this.menuService.removeCibo(product);
  }

  // Somma del prezzo totale dei prodotti contenuti nel carrello
  getTotalPrice(): void {
    this.totalPrice = 0;
    this.carrello.orderDetails.forEach(dettaglio => {
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