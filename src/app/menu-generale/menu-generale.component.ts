import { Component, numberAttribute, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Prodotto } from '../../modules/product';
import { Cart } from '../../modules/cart';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MenuService } from '../../services/menu.service';
import { OrderDetails } from '../../modules/orderDetails';

@Component({
  selector: 'app-menu-generale',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './menu-generale.component.html',
  styleUrl: './menu-generale.component.css'
})
export class MenuGeneraleComponent implements OnInit, OnDestroy {

  constructor(private menuService: MenuService, private route: ActivatedRoute, private apiService: ApiService) {}

  ciboArray: Prodotto[] = [];
  bevandaArray: Prodotto[] = [];
  dolceArray: Prodotto[] = [];
  counters: number[] = [];
  carrello: Cart = { cart: [] };

  private counterSubscription: any;

  // Scorrimento automatico alla sezione con fragment
  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  ngOnInit() {
    // Carica i prodotti selezionati nel carrello
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.carrello.cart = value.orderDetails;
      this.aggiornaQuantitaVisuale();
    }, error => {
      alert("I prodotti non sono stati caricati correttamente nel carrello");
    });

    this.apiService.getProductCibo().subscribe(prodotti => {
      this.ciboArray = prodotti;
      this.ciboArray.forEach(prodotto => {
        const prodottoNelCarrello = this.carrello.cart.find(c => c.product.name === prodotto.name);
        prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
      });
    }, error => {
      alert("I cibi non sono stati caricati correttamente");
    });

    this.apiService.getProductBevande().subscribe(prodotti => {
      this.bevandaArray = prodotti;
      this.bevandaArray.forEach(prodotto => {
        const prodottoNelCarrello = this.carrello.cart.find(c => c.product.name === prodotto.name);
        prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
      });
    }, error => {
      alert("Le bevande non sono state caricate correttamente");
    });

    this.apiService.getProductDolci().subscribe(prodotti => {
      this.dolceArray = prodotti;
      this.dolceArray.forEach(prodotto => {
        const prodottoNelCarrello = this.carrello.cart.find(c => c.product.name === prodotto.name);
        prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
      });
    }, error => {
      alert("I dolci non sono stati caricati correttamente");
    });
  }

  // Funzione per aggiornare la quantità visiva dei prodotti
  aggiornaQuantitaVisuale(): void {
    this.ciboArray.forEach(prodotto => {
      const prodottoNelCarrello = this.carrello.cart.find(c => c.product.name === prodotto.name);
      prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
    });
  
    this.bevandaArray.forEach(prodotto => {
      const prodottoNelCarrello = this.carrello.cart.find(c => c.product.name === prodotto.name);
      prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
    });

    this.dolceArray.forEach(prodotto => {
      const prodottoNelCarrello = this.carrello.cart.find(c => c.product.name === prodotto.name);
      prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
    });
  }
  

  // Incrementa la quantità dell'elemento selezionato
  incrementCounter(cibo: Prodotto): void {
    this.menuService.incrementCounter(cibo);
  }

  // Decrementa la quantità dell'elemento selezionato
  decrementCounter(cibo: Prodotto): void {
    this.menuService.decrementCounter(cibo);
  }

  ngOnDestroy() {
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
  }
}
