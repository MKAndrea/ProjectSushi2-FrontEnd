import { CommonModule } from "@angular/common";
import { order } from "../../modules/order";
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { MenuService } from "../../services/menu.service";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderCart: order[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private menuService: MenuService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.apiService.getProductCart().subscribe({
      next: values => {
        this.orderCart = values;
      },
      error: () => {
        alert("Errore nel caricamento degli ordini.");
      }
    });
  }

  editOrder(order: order): void {
    this.menuService.setCart({ orderDetails: [...order.orderDetails] });
    this.storageService.setItem('ordineInModificaId', String(order.id));
    this.menuService.setIsEditing(true);
    this.router.navigate(['/cart']);
  }

  deleteOrder(id: number): void {
    if (!confirm("Sei sicuro di voler eliminare questo ordine?")) return;

    this.apiService.deleteOrder(id).subscribe({
      next: () => {
        this.orderCart = this.orderCart.filter(order => order.id !== id);
        alert("Ordine eliminato con successo");
      },
      error: () => {
        alert("Errore durante l'eliminazione dell'ordine");
      }
    });
  }
}

