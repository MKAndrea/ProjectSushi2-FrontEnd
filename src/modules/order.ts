
import { OrderDetails } from "./orderDetails";

export interface Order{
    id?: number
    orderDetails: OrderDetails[]
}