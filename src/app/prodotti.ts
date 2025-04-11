import { Bevanda } from "./bevanda";
import { Cibo } from "./ProductDTO";
import { Dolce } from "./dolci";

export interface Prodotti{
    cibo: Cibo[],
    bevanda: Bevanda[],
    dolce: Dolce[],
}