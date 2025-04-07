import { Cibo } from "./cibo";
import { Prodotti } from "./prodotti";

export interface Cart{
    cart: Cibo[],
    prodotti: Prodotti[]
}
