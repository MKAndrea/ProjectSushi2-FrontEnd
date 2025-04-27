import { ChangeDetectorRef, Component } from '@angular/core';
import { Prodotto } from '../../modules/product';
import { Category } from '../apiCatalog/category';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { EditDeleteService } from '../../services/edit-delete.service';
import { MenuService } from '../../services/menu.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-gestione-prodotti',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './gestione-prodotti.component.html',
  styleUrl: './gestione-prodotti.component.css'
})
export class GestioneProdottiComponent {

  ciboArray: Prodotto[] = [];
  isDropDownVisible = false;
  dropdownPosition = { top: '0px', left: '0px' };
  isReadOnly: boolean[] = [];
  solidBorder: string[] = [];
  isEdit: boolean[] = [];
  originalCiboArray: Prodotto[] = [];
  border: string = "";
  isOpen: boolean = false;
  isAdmin: boolean = false;

  createProduct: Prodotto = {
    name: "",
    ingredients:"",
    description: "",
    price: 0,
    productImage:"",
    category: Category.CIBO
  }
  

  ngOnInit(): void {
    this.menuService.isAdmin$.subscribe(response => {
      this.isAdmin = response
    })

    //Riceve tutti i prodotti contenuti nel DB
    this.apiService.getProduct().subscribe({
      next: (prodottiCibo) => {
        this.ciboArray = prodottiCibo;
    
        // Attiva o disattiva la modifica nel menu
        this.isReadOnly = this.ciboArray.map(() => true);
        this.isEdit = this.ciboArray.map(() => true);
        this.solidBorder = this.ciboArray.map(() => "none");
      },
      error: (error) => {
        alert("The products were not loaded correctly.");
      }
    });
    this.editDeleteService.isDropdownVisible$.subscribe(visible => {
      this.isDropDownVisible = visible;
    });

    this.editDeleteService.dropdownPosition$.subscribe(position => {
      this.dropdownPosition = position;
    });
  }

  constructor(private router: Router, private apiService: ApiService, private editDeleteService: EditDeleteService, private menuService: MenuService, private cdRef: ChangeDetectorRef){}

  //Al click porta alla sezione dedicata
  navigateToProduct(section: string): void{
    this.router.navigate(['/menu'], {fragment: section})
  }

  showTendina(event: MouseEvent): void{
    this.editDeleteService.showTendina(event)
  }

  //Cambia la visualizzazione degli input al click del pulsante modifica
  changeInput(index: number): void {
    if (this.isReadOnly[index] && this.isEdit[index]) {
      // Copia dei valori da salvare
      const original = this.ciboArray[index];
      this.originalCiboArray[index] = Object.assign({}, this.ciboArray[index]);
      this.isReadOnly[index] = false;
      this.border = "1px solid black";
      this.solidBorder[index] = this.border;
      this.isEdit[index] = false;
    }
  }

  goBack(index: number): void {
    if (!this.isEdit[index]) {
      const original = this.originalCiboArray[index];
      if (original) {
        Object.assign(this.ciboArray[index], original);
      }
  
      this.isReadOnly[index] = true;
      this.border = "none";
      this.solidBorder[index] = this.border;
      this.isEdit[index] = true;
    }
  }

  //Aggiunge un prodotto al DB
  addProduct(): void {
    if (
      !this.createProduct.name ||
      !this.createProduct.ingredients ||
      !this.createProduct.description ||
      !this.createProduct.price ||
      !this.createProduct.productImage ||
      !this.createProduct.category
    ) {
      alert("Please fill in all the fields before adding a product.");
      return;
    }
    
    this.apiService.addProduct(this.createProduct).subscribe({
      next: (newProduct: Prodotto) => {
        this.ciboArray.push(newProduct);
        this.createProduct = {
          name: "",
          ingredients: "",
          description: "",
          price: 0,
          productImage: "",
          category: Category.CIBO
        };
        this.isReadOnly = this.ciboArray.map(() => true);
        this.isEdit = this.ciboArray.map(() => true);
        this.solidBorder = this.ciboArray.map(() => "none");
        alert("Product Added!");
      },
      error: (error) => {
        alert("The product was not added correctly, please try again.");
      }
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
      if (confirm("Are you sure you want to remove this item from the menu?")) {
        this.apiService.deleteProductById(id).subscribe({
          next: () => {
            forkJoin({
              dolci: this.apiService.getProductDolci(),
              bevande: this.apiService.getProductBevande(),
              cibo: this.apiService.getProductCibo()
            }).subscribe({
              next: ({ dolci, bevande, cibo }) => {
                this.ciboArray = [...dolci, ...bevande, ...cibo];
              },
              error: (error) => {
                alert("Failed to reload products after deletion.");
                console.error(error);
              }
            });
    
            alert("Product removed!");
          },
          error: (error) => {
            alert("The product was not deleted successfully.");
            console.error(error);
          }
        });
      }
    }

    //Aggiorna un prodotto dal DB
    updateProduct(index: number, id: number, body: Prodotto): void {
    if (confirm("Are you sure you want to update this product?")) {
      this.apiService.updateProductById(id, body).subscribe({
        next: () => {
          this.isReadOnly[index] = true;
          this.isEdit[index] = true;
          this.border = "none";
          this.solidBorder[index] = this.border;
          this.cdRef.detectChanges();
          alert("Product updated successfully.");
        },
        error: (error) => {
          console.error("Errore nell'aggiornamento del prodotto:", error);
          alert("The product was not updated correctly.");
        }
      });
    } else {
      alert("Operation cancelled.");
    }
}

  //Apre e chiude la tendina "Modifica ed Elimina prodotti contenuto nel menu principale"
  toggleMEnu(): void{
    this.isOpen = !this.isOpen
  }
}
