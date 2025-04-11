import { orderDTO } from "../orderDTO";
import { Cibo } from "./ProductDTO";
import { Prodotti } from "./prodotti";

export interface Cart{
    cart: Cibo[]
    prodotti: Prodotti[]
}
