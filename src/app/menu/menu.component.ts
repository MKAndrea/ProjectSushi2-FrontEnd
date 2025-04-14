import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { IntroduzioneComponent } from "../introduzione/introduzione.component";
import { ApiService } from '../../services/api.service';
import { Cibo } from '../../modules/product';
import { TendinaComponent } from "../tendina/tendina.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { EditDeleteService } from '../../services/edit-delete.service';

@Component({
  selector: 'app-menu',
  imports: [HeaderComponent, IntroduzioneComponent, TendinaComponent, FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  ciboArray: Cibo[] = [];
  isDropDownVisible = false;
  dropdownPosition = { top: '0px', left: '0px' };
  isReadOnly: boolean[] = [];
  solidBorder: string[] = [];
  border: string = "";
  isOpen = false;
  changeButton = false;

  createProduct: Cibo = {
    name: "",
    ingredients:"",
    description: "",
    price: 0,
    productImage:"",
    category: ""
  }

  ngOnInit(): void {
    this.apiService.getProva().subscribe(prodottiCibo => {
      this.ciboArray = prodottiCibo;
    })
    this.editDeleteService.isDropdownVisible$.subscribe(visible => {
      this.isDropDownVisible = visible;
    });

    this.editDeleteService.dropdownPosition$.subscribe(position => {
      this.dropdownPosition = position;
    });
    this.isReadOnly = this.ciboArray.map(() => true)
    this.solidBorder = this.ciboArray.map(() => "none")
  }

  constructor(private router: Router, private apiService: ApiService, private editDeleteService: EditDeleteService){}

  navigateToProdotti(section: string){
    this.router.navigate(['/menu'], {fragment: section})
  }

  showTendina(event: MouseEvent){
    this.editDeleteService.showTendina(event)
  }

  changeInput(index: number) {
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

    addProduct(){
      this.apiService.addProduct(this.createProduct).subscribe((newProduct: Cibo) => {
        this.ciboArray.push(newProduct);
        this.createProduct = {
          name: "",
          ingredients:"",
          description: "",
          price: 0,
          productImage:"",
          category: ""
        };
      });
    }

    deleteProduct(id: number){
      if(confirm("Sei sicuro di voler cancellare questo prodotto dal menu?")){
        this.apiService.deleteProductById(`http://localhost:8080/product/${id}`).subscribe(() => {
          this.apiService.getProductDolci().subscribe(prodotti =>{
            this.ciboArray = prodotti;
          })
          this.apiService.getProductBevande().subscribe(prodotti =>{
            this.ciboArray = prodotti;
          })
          this.apiService.getProductCibo().subscribe(prodotti =>{
            this.ciboArray = prodotti;
          })
        }, error => {
          alert("Il prodootto non è stato cancellato correttamente")
        })
        alert("Prodotto rimosso")
      }
    }

    updateProduct(id: number, data:Cibo){
      this.isReadOnly[id] = !this.isReadOnly[id];
      this.border = "none";
      this.solidBorder[id] = this.border;
      this.apiService.updateProductById(`http://localhost:8080/product`,id, data).subscribe(() => {
      }, error => {
        alert("Il prodotto non è stato aggiornato correttamente")
      })
    }

  toggleMEnu(){
    this.isOpen = !this.isOpen
  }
}


