import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prodotto } from '../../modules/product';
import { ApiService } from '../../services/api.service';
import { find } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  private counterSubscription: any;

  constructor(private router: Router, private menuService: MenuService, private apiService: ApiService){

  }

  searchProduct = "";

  productArray: Prodotto[] = [];

  generalCounter: number = 0;

  isLogged = false;

  showLogOut = false;

  ngOnInit(): void {
    //Aumenta il counter del carrello contenuto nell'header
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.generalCounter = 0;
      value.orderDetails.forEach(cibo => this.generalCounter += cibo.quantity!)
    })
    this.isLogged = this.menuService.getIslogged();

    this.apiService.getProduct().subscribe(response => {
      this.productArray = response;
    })
  }

  //Quando clicchi su un buttone ti porta ad un'altra pagina
  onClick(url: string): void{
    this.router.navigateByUrl(url);
  }

  filteredProducts(): Prodotto[] {
    const filteredArray = this.productArray.filter(product =>
      product.name!.toLowerCase().includes(this.searchProduct.toLowerCase())
    );
    if(filteredArray != null && filteredArray.length > 1){
      console.log(filteredArray);
      alert(`Esistono ${filteredArray.length} prodotti con questo nome`)
    }
    else if(filteredArray != null && filteredArray.length > 0){
      alert(`Esiste un solo prodotto con questo nome`)
    }
    else{
      alert("Non esiste nessun prodotto con questo nome");
    }
    return filteredArray;
  }

  logOut(){
    this.showLogOut = true;
    document.body.style.overflow = "hidden";
  }

  confirmLogOut(){
      this.showLogOut = false;
      this.isLogged = false;
      this.menuService.setIslogged(false);
      document.body.style.overflow = "auto";
      this.router.navigate([""]);
  }

  goBack(){
    this.showLogOut = false;
  }

}
