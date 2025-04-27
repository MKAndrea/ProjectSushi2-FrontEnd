import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { CardCartComponent } from "../card-cart/card-cart.component";
import { ApiService } from '../../services/api.service';
import { Order } from '../../modules/order';
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

  // ordineInModificaId: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  carrello: Order = { orderDetails: [] };

  orderHistory: Order[] = []; //orderHistory

  // isEditing: boolean = false;

  totalPrice: number = 0;

  ngOnInit(): void {

    // this.menuService.isEditing$.subscribe(isEditing => {
    //   this.isEditing = isEditing;
    //   this.cdr.detectChanges();
    // });

    // this.isEditing = this.menuService.getIsEdit();
    
    this.menuService.getCarrelloAsObservable().subscribe({
      next: (value) => {
        console.log('Dati del carrello ricevuti:', value);
        // this.carrello.orderDetails = value.orderDetails;
        this.carrello = value;
        console.log(this.carrello);
        this.getTotalPrice();
      },
      error: (error) => {
        alert("The products in the cart were not sent correctly");
      },
    });

    // Visualizza tutti gli elementi contenuti nel carrello
    this.apiService.getProductCart().subscribe({
      next: (values) => {
        values.forEach(value => {
          this.orderHistory.push(value);
        });
        this.orderHistory = [...this.orderHistory];
      },
      error: (error) => {
        alert("The products in the cart were not sent correctly");
      }
    });

    // const savedId = this.storageService.getItem('ordineInModificaId');
    // if (savedId) {
    //   this.ordineInModificaId.next(Number(savedId));
    // }
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

  // Invia l'ordine appena premi il pulsante send order(quella originale)
  // sendOrder(): void {
  //   this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
  //     this.carrello.orderDetails = value.orderDetails;

  //     const ORDERDTO: Order = {
  //       orderDetails: this.carrello.orderDetails
  //     };

  //     if (confirm(`You are about to send the order, are you sure?`)) {
  //       this.apiService.sendProductCart(ORDERDTO).subscribe((response: any) => {
  //         ORDERDTO.id = response.id;
  //         ORDERDTO.orderDetails = response.orderDetails;
  //         this.orderCart.push(ORDERDTO);
  //         this.menuService.resetCart();
  //         this.carrello.orderDetails = [];
  //         console.log(this.orderCart);
  //         alert("Order Sent!");
  //       }, error => {
  //         alert("Error")
  //       });
  //     }
  //   });
  // }

  sendOrder(): void {
    this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
      const filteredOrderDetails = value.orderDetails.filter(item => item.quantity > 0);
  
      if (filteredOrderDetails.length === 0) {
        alert("There are no products with quantity greater than 0 to send.");
        this.menuService.resetCart();
        this.carrello = { id: 0, orderDetails: [] };
        return;
      }
  
      this.carrello.orderDetails = filteredOrderDetails;
  
      const ORDERDTO: Order = {
        orderDetails: this.carrello.orderDetails
      };
  
      if (confirm(`You are about to send the order, are you sure?`)) {
        this.apiService.sendProductCart(ORDERDTO).subscribe({
          next: (response: any) => {
            ORDERDTO.id = response.id;
            ORDERDTO.orderDetails = response.orderDetails;
  
            this.orderHistory.push(ORDERDTO);
            this.menuService.resetCart();
            this.carrello = { id: 0, orderDetails: [] };
            this.totalPrice = 0;
  
            alert("Order Sent!");
          },
          error: () => {
            alert("Error sending the order.");
          }
        });
      }
    });
  }

  // sendOrder(): void {
  //   this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
  //     const filteredOrderDetails = value.orderDetails.filter(item => item.quantity > 0);
  
  //     if (filteredOrderDetails.length === 0) {
  //       alert("There are no products with quantity greater than 0 to send.");
  //       this.menuService.resetCart();
  //       return;
  //     }
  
  //     this.carrello.orderDetails = filteredOrderDetails;
  
  //     const ORDERDTO: Order = {
  //       orderDetails: this.carrello.orderDetails
  //     };
  
  //     if (confirm(`You are about to send the order, are you sure?`)) {
  //       this.apiService.sendProductCart(ORDERDTO).subscribe({
  //         next: (response: any) => {
  //           ORDERDTO.id = response.id;
  //           ORDERDTO.orderDetails = response.orderDetails;
      
  //           this.orderHistory.push(ORDERDTO);
  //           this.menuService.resetCart();
  //           this.carrello.orderDetails = [];
      
  //           console.log(this.orderHistory);
  //           alert("Order Sent!");
  //         },
  //         error: (error) => {
  //           alert("Error sending the order.");
  //         }
  //       });
  //     }
  //   });
  // }

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

  // editOrder(orderDaModificare: Order): void { (non serve più perchè utiliziamo il tutto in orderhistory)
  //   this.carrello.orderDetails = [...orderDaModificare.orderDetails];
  //   this.menuService.setCart({ orderDetails: [...orderDaModificare.orderDetails] });
  //   this.getTotalPrice();
  
  //   this.isEditing= true;
  //   this.menuService.setIsEdit(true);
  //   // this.menuService.setIsEditing(true);
  
  //   this.ordineInModificaId.next(orderDaModificare.id ?? null);
  //   this.storageService.setItem('ordineInModificaId', String(orderDaModificare.id));
  
  //   console.log('Modalità modifica attiva. Carrello aggiornato con ordine esistente:', this.carrello.orderDetails);
  // }

  // editOrder(orderDaModificare: Order): void {
  //   // this.carrello.orderDetails = [...orderDaModificare.orderDetails];
  //   // this.menuService.setCart({ orderDetails: [...orderDaModificare.orderDetails] });
  //   // this.getTotalPrice();
  //   // this.ordineInModificaId.next(orderDaModificare.id ?? null);
  //   // this.storageService.setItem('ordineInModificaId', String(orderDaModificare.id));

  //   // associo gli elementi ad id e orderDetails
  //   this.carrello = { 
  //     id: orderDaModificare.id, 
  //     orderDetails: [...orderDaModificare.orderDetails] 
  //   };
  
  //   // Aggiorna lo stato del carrello nel servizio
  //   this.menuService.setCart(this.carrello);
  
  //   // Calcola il prezzo totale aggiornato
  //   this.getTotalPrice();
  
  //   console.log('Modifica ordine attiva. Ordine ID:', this.carrello.id, 'Dettagli:', this.carrello.orderDetails);
  // }
  
  
  navigateToShowOrder(){
    this.router.navigate(['/order-history'])
  }
  
  orderUpdate(): void {

    // const idOrdine = this.ordineInModificaId.value;
  
    // if (!idOrdine) {
    //   alert("Error ID.");
    //   return
    // }
    
    if (!this.carrello.id) {
      alert("Missing order ID.");
      return;
    }
  
    const prodottiValidi = this.carrello.orderDetails.filter(item => item.quantity > 0);
    const ordineAggiornato: Order = {
      id: this.carrello.id,
      orderDetails: prodottiValidi
    };
  
    this.apiService.updateProductCart(this.carrello.id, ordineAggiornato).subscribe({
      next: () => {
        this.getTotalPrice();
  
        const index = this.orderHistory.findIndex(o => o.id === this.carrello.id);
        if (index !== -1) {
          this.orderHistory[index] = ordineAggiornato;
          this.orderHistory = [...this.orderHistory];
        }
  
        alert("Order modified successfully!");
      },
      error: (error) => {
        console.error("Update order error:", error);
        alert("Error updating order.");
      }
    });
    // this.carrello.orderDetails = [];
    // this.isEditing = false;
    // this.menuService.setIsEdit(false);
    // this.menuService.setIsEditing(false);
    // this.ordineInModificaId.next(null);
    this.menuService.resetCart();
    this.carrello = { id: 0, orderDetails: [] };
    this.totalPrice = 0;
  }
  // orderUpdate(): void {
  //   const idOrdine = this.ordineInModificaId.value;
  
  //   if (!idOrdine) {
  //     alert("Error ID.");
  //     return;
  //   }
  
  //   const prodottiValidi = this.carrello.orderDetails.filter(item => item.quantity > 0);
  //   const ordineAggiornato: Order = {
  //     id: idOrdine,
  //     orderDetails: prodottiValidi
  //   };
  
  //   this.apiService.updateProductCart(idOrdine, ordineAggiornato).subscribe({
  //     next: () => {
  //       this.getTotalPrice();
    
  //       const index = this.orderHistory.findIndex(o => o.id === idOrdine);
  //       if (index !== -1) {
  //         this.orderHistory[index] = ordineAggiornato;
  //         this.orderHistory = [...this.orderHistory];
  //       }
    
  //       alert("Order modified successfully!");
  //     },
  //     error: (error) => {
  //       console.error("Update order error:", error);
  //       alert("Error updating order.");
  //     }
  //   });
  
  //   this.menuService.resetCart();
  //   this.carrello.orderDetails = [];
  //   this.isEditing = false;
  //   this.menuService.setIsEdit(false);
  //   // this.menuService.setIsEditing(false);
  //   this.ordineInModificaId.next(null);
  // }
  
  
  deleteOrder(id: number) {
    if (!confirm("Are you sure you want to delete this order?")) return;
  
    this.apiService.deleteOrder(id).subscribe({
      next: () => {
        this.orderHistory = this.orderHistory.filter(order => order.id !== id);
        alert("Order delete successfully");
      },
      error: (error) => {
        console.error('Error deleting order:', error);
      }
    });
  }
  
  // private resetLogicButtons(): void{
  //   if (this.isEditing && this.carrello.orderDetails.length === 0) {
  //     this.isEditing = false;
  //     this.menuService.setIsEdit(false);
  //     this.ordineInModificaId.next(null);
  //     this.storageService.removeItem('ordineInModificaId');
  //     console.log('Modalità modifica disattivata perché il carrello è stato svuotato.');
  //   }
  // }

  // Rimuovi il prodotto dal carrello
  // removeProduct(product: OrderDetails): void {
  //   this.menuService.removeCibo(product);
  //   this.getTotalPrice();
  //   this.resetLogicButtons(); // Controlla se il carrello è vuoto e disattiva modifica
  // }

  removeProduct(product: OrderDetails): void {
    this.menuService.removeCibo(product);
    this.getTotalPrice();
    // this.resetLogicButtons(); // Controlla se il carrello è vuoto e disattiva modifica
  
    if (this.carrello.orderDetails.length === 0 && this.carrello.id) {
      this.menuService.resetCart();
      console.log("Cart emptied. Exiting edit mode.");
    }
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