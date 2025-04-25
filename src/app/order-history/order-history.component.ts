import { CommonModule } from "@angular/common";
import { Order } from "../../modules/order";
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

  orderCart: Order[] = [];

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
        alert("Error loading the orders.");
      }
    });
  }

  // editOrder(order: Order): void {
  //   this.menuService.setCart({ orderDetails: [...order.orderDetails] });
  //   // this.storageService.setItem('ordineInModificaId', String(order.id));
  //   // this.menuService.setIsEditing(true);
  //   // this.menuService.setIsEdit(true)
  //   this.router.navigate(['/cart']);
  // }

  editOrder(order: Order): void {
    // Imposta il carrello con i dettagli dell'ordine da modificare
    this.menuService.setCart({ orderDetails: [...order.orderDetails], id: order.id });
    this.router.navigate(['/cart']);
  }

  deleteOrder(id: number): void {
    if (!confirm("Are you sure you want to delete this order?")) return;

    this.apiService.deleteOrder(id).subscribe({
      next: () => {
        this.orderCart = this.orderCart.filter(order => order.id !== id);
        alert("Order deleted successfully.");
      },
      error: () => {
        alert("Error while deleting the order.");
      }
    });
  }

    //Visualizza il prezzo totale 
    getTotalOfOrder(order: any): number {
      return order.orderDetails.reduce((sum: number, item: any) => {
        return sum + (item.product.price * item.quantity);
      }, 0);
    }
}

