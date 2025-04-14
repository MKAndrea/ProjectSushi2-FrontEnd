import { Cart } from "./cart";
import { Prodotto } from "./product";
import { OrderDetails } from "./orderDetails";

export interface orderDTO{
    id?: number
    orderDetails: OrderDetails[]
}