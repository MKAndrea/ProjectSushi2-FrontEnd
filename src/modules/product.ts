import { Category } from "../app/apiCatalog/category"

export interface Prodotto{
    id?: number,
    name?: string,
    price?: number,
    productImage?: string,
    ingredients?: string,
    description?: string,
    procedimento?: string,
    quantity?: number
    category?: Category
}

