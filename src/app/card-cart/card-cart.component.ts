import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDetails } from '../../modules/orderDetails';
import { Prodotto } from '../../modules/product';

@Component({
  selector: 'app-card-cart',
  standalone: true,
  templateUrl: './card-cart.component.html',
  styleUrl: './card-cart.component.css'
})
export class CardCartComponent {
  @Input() item!: OrderDetails;

  @Output() remove = new EventEmitter<OrderDetails>();
  @Output() decrement = new EventEmitter<Prodotto>();
  @Output() increment = new EventEmitter<Prodotto>();

  removeProduct() {
    this.remove.emit(this.item);
  }

  decrementCounter() {
    this.decrement.emit(this.item.product);
  }

  incrementCounter() {
    this.increment.emit(this.item.product);
  }
}
