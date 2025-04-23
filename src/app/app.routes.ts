import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { ContattiComponent } from './contatti/contatti.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { MenuGeneraleComponent } from './menu-generale/menu-generale.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AdminComponent } from './admin/admin.component';
import { GestioneProdottiComponent } from './gestione-prodotti/gestione-prodotti.component';

export const routes: Routes = [
    {path:"", pathMatch:"full", component: HomeComponent},
    {path:"login", component: AdminComponent},
    {path: "gestione", component: GestioneProdottiComponent},
    {path:"menu", component: MenuGeneraleComponent},
    {path:"about", component: AboutComponent},
    {path: "order-history", component: OrderHistoryComponent},
    {path:"cart", component: CartComponent},
];
