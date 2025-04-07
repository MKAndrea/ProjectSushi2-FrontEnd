import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { ContattiComponent } from './contatti/contatti.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { MenuGeneraleComponent } from './menu-generale/menu-generale.component';

export const routes: Routes = [
    {path:"", pathMatch:"full", component: HomeComponent},
    {path:"menu", component: MenuGeneraleComponent},
    {path:"about", component: AboutComponent},
    {path:"cart", component: CartComponent}
];
