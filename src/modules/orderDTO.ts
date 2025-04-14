import { Cart } from "./cart";
import { Cibo } from "./product";
import { orderDetailsDTO } from "./orderDetailsDTO";

export interface orderDTO{
    id?: number
    orderDetails: orderDetailsDTO[]
}