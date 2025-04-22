import { Component, numberAttribute, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Prodotto } from '../../modules/product';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MenuService } from '../../services/menu.service';
import { OrderDetails } from '../../modules/orderDetails';
import { Order } from '../../modules/order';
import { forkJoin, take } from 'rxjs';

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
  carrello: Order = { orderDetails: [] };
  isDataLoaded = true;

  private counterSubscription: any;

  // Scorrimento automatico alla sezione con fragment

  // ngAfterViewChecked() {
  //   this.route.fragment.subscribe(fragment => {
  //     if (fragment) {
  //       const element = document.getElementById(fragment);
  //       if (element) {
  //         element.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     }
  //   });
  // }

  // ngAfterViewChecked(): void {
  //   this.route.fragment.subscribe(fragment => {
  //     if (fragment && this.isDataLoaded) { // Assicurati che i dati siano caricati
  //       const element = document.getElementById(fragment);
  //       if (element) {
  //         setTimeout(() => {
  //           element.scrollIntoView({ behavior: 'smooth' });
  //         }, 100); // Aspetta un piccolo timeout per garantire che il DOM sia stato aggiornato
  //       }
  //     }
  //   });
  // }

  scrollToFragment() {
    this.route.fragment.pipe(take(1)).subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }

  loadData(): void {
    forkJoin([
      this.apiService.getProductCibo(),
      this.apiService.getProductBevande(),
      this.apiService.getProductDolci()
    ]).subscribe({
      next: ([cibo, bevande, dolci]) => {
        this.ciboArray = cibo;
        this.bevandaArray = bevande;
        this.dolceArray = dolci;
        this.isDataLoaded = true;

        this.aggiornaQuantitaVisuale(); 
  
        // Scroll alla sezione dopo il caricamento
        setTimeout(() => {
          this.scrollToFragment();
        }, 0);
      },
      error: (err) => {
        console.error("Errore nel caricamento:", err);
      }
    });
  }

  ngOnInit() {
    // Carica i prodotti selezionati nel carrello
    this.menuService.getCarrelloAsObservable().subscribe({
      next: (value) => {
        this.carrello.orderDetails = value.orderDetails;
        this.aggiornaQuantitaVisuale();
      },
      error: (error) => {
        alert("The products were not loaded correctly into the cart.");
      }
    });
    

    this.apiService.getProductCibo().subscribe({
      next: (prodotti) => {
        this.ciboArray = prodotti;
        this.ciboArray.forEach(prodotto => {
          const prodottoNelCarrello = this.carrello.orderDetails.find(c => c.product.name === prodotto.name);
          prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
        });
      },
      error: (error) => {
        alert("The foods were not loaded correctly.");
      }
    });
    

    this.apiService.getProductBevande().subscribe({
      next: (prodotti) => {
        this.bevandaArray = prodotti;
        this.bevandaArray.forEach(prodotto => {
          const prodottoNelCarrello = this.carrello.orderDetails.find(c => c.product.name === prodotto.name);
          prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
        });
      },
      error: (error) => {
        alert("The drinks were not loaded correctly.");
      }
    });
    

    this.apiService.getProductDolci().subscribe({
      next: (prodotti) => {
        this.dolceArray = prodotti;
        this.dolceArray.forEach(prodotto => {
          const prodottoNelCarrello = this.carrello.orderDetails.find(c => c.product.name === prodotto.name);
          prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
        });
      },
      error: (error) => {
        alert("The desserts were not loaded correctly.");
      }
    });
    
    this.loadData();
  }

  // Funzione per aggiornare la quantità visiva dei prodotti
  aggiornaQuantitaVisuale(): void {
    this.ciboArray.forEach(prodotto => {
      const prodottoNelCarrello = this.carrello.orderDetails.find(c => c.product.name === prodotto.name);
      prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
    });
  
    this.bevandaArray.forEach(prodotto => {
      const prodottoNelCarrello = this.carrello.orderDetails.find(c => c.product.name === prodotto.name);
      prodotto.quantity = prodottoNelCarrello ? prodottoNelCarrello.quantity : 0;
    });

    this.dolceArray.forEach(prodotto => {
      const prodottoNelCarrello = this.carrello.orderDetails.find(c => c.product.name === prodotto.name);
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
