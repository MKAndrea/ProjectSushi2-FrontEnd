import { Cart } from "./app/cart";
import { Cibo } from "./app/cibo";
import { orderDetailsDTO } from "./orderDetailsDTO";

export interface orderDTO{
    id: number
    orderDetails: orderDetailsDTO[]
}