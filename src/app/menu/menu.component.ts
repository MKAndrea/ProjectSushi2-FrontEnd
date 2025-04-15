import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { IntroduzioneComponent } from "../introduzione/introduzione.component";
import { ApiService } from '../../services/api.service';
import { Prodotto } from '../../modules/product';
import { TendinaComponent } from "../tendina/tendina.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { EditDeleteService } from '../../services/edit-delete.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [HeaderComponent, IntroduzioneComponent, TendinaComponent, FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  ciboArray: Prodotto[] = [];
  isDropDownVisible = false;
  dropdownPosition = { top: '0px', left: '0px' };
  isReadOnly: boolean[] = [];
  solidBorder: string[] = [];
  border: string = "";
  isOpen = false;
  changeButton = false;

  createProduct: Prodotto = {
    name: "",
    ingredients:"",
    description: "",
    price: 0,
    productImage:"",
    category: ""
  }
  

  ngOnInit(): void {
    //Riceve tutti i prodotti contenuti nel DB
    this.apiService.getProduct().subscribe(prodottiCibo => {
      this.ciboArray = prodottiCibo;
    }, error => {
      alert("I prodotti non sono stati caricati correttamente")
    })
    this.editDeleteService.isDropdownVisible$.subscribe(visible => {
      this.isDropDownVisible = visible;
    });

    this.editDeleteService.dropdownPosition$.subscribe(position => {
      this.dropdownPosition = position;
    });
    //Attiva o disattiva la modifica nel menu
    this.isReadOnly = this.ciboArray.map(() => true)
    this.solidBorder = this.ciboArray.map(() => "none")
  }

  constructor(private router: Router, private apiService: ApiService, private editDeleteService: EditDeleteService){}

  //Al click porta alla sezione dedicata
  navigateToProdotti(section: string): void{
    this.router.navigate(['/menu'], {fragment: section})
  }

  showTendina(event: MouseEvent): void{
    this.editDeleteService.showTendina(event)
  }

  //Cambia la visualizzazione degli input al click del pulsante modifica
  changeInput(index: number): void {
    if(this.isReadOnly[index]){
      this.isReadOnly[index] = !this.isReadOnly[index];
      this.border = "1px solid black";
      this.solidBorder[index] = this.border;
      this.changeButton = true
    }
    else{
      this.isReadOnly[index] = !this.isReadOnly[index];
      this.border = "none";
      this.solidBorder[index] = this.border;
    }
  }

  //Aggiunge un prodotto al DB
    addProduct(): void{
      this.apiService.addProductt(this.createProduct).subscribe((newProduct: Prodotto) => {
        this.ciboArray.push(newProduct);
        this.createProduct = {
          name: "",
          ingredients:"",
          description: "",
          price: 0,
          productImage:"",
          category: ""
        };
      }, error => {
        alert("Il prodotto non è stato aggiunto correttamente, riprova")
      });
    }

    // deleteProduct(id: number): void{
    //   if(confirm("Sei sicuro di voler cancellare questo prodotto dal menu?")){
    //     this.apiService.deleteProducttById(id).subscribe(() => {
    //       this.apiService.getProductDolcii().subscribe(dolci =>{
    //         this.ciboArray = [...this.ciboArray, ...dolci];
    //       })
    //       this.apiService.getProductBevandee().subscribe(bevande =>{
    //         this.ciboArray = [...this.ciboArray, ...bevande];
    //       })
    //       this.apiService.getProductCiboo().subscribe(cibo =>{
    //         this.ciboArray = [...this.ciboArray, ...cibo];
    //       })
    //     }, error => {
    //       alert("Il prodootto non è stato cancellato correttamente")
    //     })
    //     alert("Prodotto rimosso")
    //   }
    // }

    //ELimina un prodotto dal DB
    deleteProduct(id: number): void {
      if (confirm("Sei sicuro di voler cancellare questo prodotto dal menu?")) {
        this.apiService.deleteProducttById(id).subscribe(() => {
          
          forkJoin({
            dolci: this.apiService.getProductDolcii(),
            bevande: this.apiService.getProductBevandee(),
            cibo: this.apiService.getProductCiboo()
          }).subscribe(({ dolci, bevande, cibo }) => {
            this.ciboArray = [...dolci, ...bevande, ...cibo];
          });
    
          alert("Prodotto rimosso");
    
        }, error => {
          alert("Il prodotto non è stato cancellato correttamente");
        });
      }
    }

    //Aggiorna un prodotto dal DB
    updateProduct(id: number, body: Prodotto): void{
      this.isReadOnly[id] = !this.isReadOnly[id];
      this.border = "none";
      this.solidBorder[id] = this.border;
      this.apiService.updateProducttById(id, body).subscribe(() => {
      }, error => {
        alert("Il prodotto non è stato aggiornato correttamente")
      })
    }

  //Apre e chiude la tendina "Modifica ed Elimina prodotti contenuto nel menu principale"
  toggleMEnu(): void{
    this.isOpen = !this.isOpen
  }
}


