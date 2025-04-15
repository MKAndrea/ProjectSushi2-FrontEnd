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
      this.carrello.cart = value.cart;
      this.aggiornaQuantitaVisuale();
    }, error => {
      alert("I prodotti non sono stati caricati correttamente nel carrello");
    });

    // Carica i cibi
    this.apiService.getProductCiboo().subscribe(prodotti => {
      this.ciboArray = prodotti;
      this.aggiornaQuantitaVisuale();
    }, error => {
      alert("I cibi non sono stati caricati correttamente");
    });

    // Carica le bevande
    this.apiService.getProductBevandee().subscribe(prodotti => {
      this.bevandaArray = prodotti;
      this.aggiornaQuantitaVisuale();
    }, error => {
      alert("Le bevande non sono state caricate correttamente");
    });

    // Carica i dolci
    this.apiService.getProductDolcii().subscribe(prodotti => {
      this.dolceArray = prodotti;
      this.aggiornaQuantitaVisuale();
    }, error => {
      alert("I dolci non sono stati caricati correttamente");
    });
  }

  // Funzione per aggiornare la quantità visiva dei prodotti
  aggiornaQuantitaVisuale(): void {
    const aggiorna = (array: Prodotto[]) => {
      array.forEach(elem => {
        const dettaglio = this.carrello.cart.find(c => c.product.name === elem.name);
        elem.quantity = dettaglio ? dettaglio.quantity : 0;
      });
    };

    aggiorna(this.ciboArray);
    aggiorna(this.bevandaArray);
    aggiorna(this.dolceArray);
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
    // Evita memory leak
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
  }
}
