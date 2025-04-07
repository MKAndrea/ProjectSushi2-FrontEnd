import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-cart',
  imports: [],
  templateUrl: './card-cart.component.html',
  styleUrl: './card-cart.component.css'
})
export class CardCartComponent {
  @Input() item: any;

  @Output() remove = new EventEmitter<any>();
  @Output() decrement = new EventEmitter<any>();
  @Output() increment = new EventEmitter<any>();


  removeCibo(){
    this.remove.emit()
  }

  decrementCounter(){
    this.decrement.emit()
  }

  incrementCounter(){
    this.increment.emit()
  }
}
