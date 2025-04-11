import { Cart } from "./app/cart";
import { Cibo } from "./app/ProductDTO";
import { orderDetailsDTO } from "./orderDetailsDTO";

export interface orderDTO{
    id?: number
    orderDetails: orderDetailsDTO[]
}