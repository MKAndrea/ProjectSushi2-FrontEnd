import { Injectable } from '@angular/core';
import { Cibo } from './ProductDTO';
import { BehaviorSubject, retry, Subject } from 'rxjs';
import { Cart } from './cart';
import { HttpClient } from '@angular/common/http';
import { Prodotti } from './prodotti';
import { Bevanda } from './bevanda';
import { Dolce } from './dolci';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  ciboArray: Cibo[] = [

  ];
  

  // bevandaArray: Bevanda[] = [
  //   {name: "Coca Cola", price: 2},
  //   {name: "Fanta", price: 2},
  //   {name: "Acqua Naturale", price: 1},
  //   {name: "Acqua Frizzante", price: 1},
  //   {name: "Sprite", price: 2},
  //   {name: "Tè Freddo al Limone", price: 3},
  //   {name: "Succhi di Frutta (Arancia)", price: 2.5},
  //   {name: "Birra", price: 4},
  //   {name: "Sake", price: 5},
  //   {name: "Shandy", price: 3}
  // ];
  

  // dolceArray: Dolce[] = [
  //   {name: "Tiramisu", price: 2, ingredienti: "uova, caffè, mascarpone, zucchero, savoiardi, cacao", procedimento: "Mescolare mascarpone con zucchero e uova, inzuppare i savoiardi nel caffè, alternare strati di crema e savoiardi, spolverare con cacao e refrigerare per qualche ora."},
  //   {name: "Mochi", price: 1, ingredienti: "farina di riso, zucchero, acqua, frutta", procedimento: "Mescolare la farina di riso con acqua e zucchero, cuocere fino a ottenere una consistenza densa, modellare il composto in piccoli dolcetti e riempirli con frutta fresca."},
  //   {name: "Cheesecake", price: 3, ingredienti: "formaggio cremoso, biscotti, burro, zucchero, panna", procedimento: "Preparare la base con biscotti tritati e burro fuso, stendere sopra una crema di formaggio cremoso, zucchero e panna, refrigerare per alcune ore."},
  //   {name: "Gelato al Matcha", price: 4, ingredienti: "panna, zucchero, matcha", procedimento: "Mescolare panna, zucchero e polvere di matcha, congelare il composto e mescolare ogni 30 minuti fino a raggiungere la consistenza di gelato."},
  //   {name: "Dorayaki", price: 2, ingredienti: "farina, uova, zucchero, miele, anko (pasta di fagioli rossi)", procedimento: "Preparare una pastella con farina, uova, zucchero e miele, cuocere dei piccoli pancake e farcirli con anko."},
  //   {name: "Kue Cubir", price: 1.5, ingredienti: "farina, zucchero, burro, colorante alimentare", procedimento: "Impastare farina, burro e zucchero, aggiungere colorante per ottenere colori vivaci, formare piccoli cubi e cuocere."},
  //   {name: "Anmitsu", price: 3, ingredienti: "gelatina, frutta, sciroppo di zucchero, fagioli rossi", procedimento: "Preparare la gelatina, servire con frutta fresca, fagioli rossi dolci e sciroppo di zucchero."},
  //   {name: "Panna Cotta", price: 3, ingredienti: "panna, zucchero, gelatina, vaniglia", procedimento: "Sciogliere la gelatina nella panna calda, aggiungere zucchero e vaniglia, versare in stampi e refrigerare fino a quando non si rassoda."},
  //   {name: "Millefoglie", price: 4, ingredienti: "pasta sfoglia, crema pasticcera, zucchero", procedimento: "Cuocere la pasta sfoglia, farcire con crema pasticcera e sovrapporre le sfoglie, spolverare con zucchero a velo."},
  //   {name: "Kakigori", price: 2.5, ingredienti: "ghiaccio tritato, sciroppo di frutta, latte condensato", procedimento: "Tritare il ghiaccio e servirlo con sciroppo di frutta e latte condensato."}
  // ];
  


  counters: number[] = Array(this.ciboArray.length).fill(0);

  // counterSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(this.counters);
  carrello: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({cart: [], prodotti: []})

  generalCounter: number = 0;

  // getGeneralCounter(){
  //   this.generalCounter = this.counters.reduce((prec, succ) => prec + succ, 0);
  //   console.log(this.generalCounter);
  //   return this.generalCounter;
  // }

  getCarrelloAsObservable() {
    return this.carrello.asObservable();
  }

  getCiboArray(){
    return this.ciboArray;
  }

  // getBevandaArray(){
  //   return this.bevandaArray;
  // }

  // getDolceArray(){
  //   return this.dolceArray;
  // }

  // questo fa ->> questa cosa
  sendOrder(prezzoTotale: number): void{
    let carTemp = this.carrello.getValue();
    if(confirm(`Stai per inviare l'ordine sei sicuro?\nIl prezzo totale è di ${prezzoTotale}$`)){
      alert("Ordine inviato!")
      carTemp.cart.forEach(element => {
        element.quantity = 0;
        carTemp.cart = [];
      });
    }
    this.carrello.next(carTemp);
  }


  incrementCounterProdotti(prodottiDaAggiungere: Prodotti, id: number) {
    let cartTemp = this.carrello.getValue();
    const indexCibo = cartTemp.prodotti.findIndex(prodotto => prodotto.cibo[id].name == prodottiDaAggiungere.cibo[id].name)
    if(indexCibo != -1){
      cartTemp.prodotti[indexCibo].cibo[id].quantity! += 1
    } else {
      prodottiDaAggiungere.cibo[id].quantity = 1;
      cartTemp.prodotti.push(prodottiDaAggiungere)
    }
    const indexBevanda = cartTemp.prodotti.findIndex(prodotto => prodotto.bevanda[id].name == prodottiDaAggiungere.bevanda[id].name)
    if(indexBevanda != -1){
      cartTemp.prodotti[indexBevanda].bevanda[id].quantity! += 1
    } else {
      prodottiDaAggiungere.bevanda[id].quantity = 1;
      cartTemp.prodotti.push(prodottiDaAggiungere)
    }
    const indexDolce = cartTemp.prodotti.findIndex(prodotto => prodotto.dolce[id].name == prodottiDaAggiungere.dolce[id].name)
    if(indexDolce != -1){
      cartTemp.prodotti[indexDolce].dolce[id].quantity! += 1
    } else {
      prodottiDaAggiungere.dolce[id].quantity = 1;
      cartTemp.prodotti.push(prodottiDaAggiungere)
    }
    this.carrello.next(cartTemp)
  }

  incrementCounter(ciboDaAggiungere: Cibo) {
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == ciboDaAggiungere.name)
    if(index != -1){
      cartTemp.cart[index].quantity! += 1
    } else {
      ciboDaAggiungere.quantity = 1;
      cartTemp.cart.push(ciboDaAggiungere)
    }
    this.carrello.next(cartTemp)
  }

  /*incrementCounter2(bevandaDaAggiungere: Bevanda) {
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(bevanda => bevanda.name == bevandaDaAggiungere.name)
    if(index != -1){
      cartTemp.cart[index].quantity! += 1
    } else {
      bevandaDaAggiungere.quantity = 1;
      cartTemp.cart.push(bevandaDaAggiungere)
    }
    this.carrello.next(cartTemp)
  }*/

  /*incrementCounter3(dolceDaAggiungere: Dolce) {
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(dolce => dolce.name == dolceDaAggiungere.name)
    if(index != -1){
      cartTemp.cart[index].quantity! += 1
    } else {
      dolceDaAggiungere.quantity = 1;
      cartTemp.cart.push(dolceDaAggiungere)
    }
    this.carrello.next(cartTemp)
  }*/

  /*incrementCounter2(prodotti: Prodotti[]) {
    let cartTemp = this.carrello.getValue();
    const prodottiDaAggiungere = cartTemp.prodotti
    const keys = Object.keys(prodottiDaAggiungere)
    const index = prodottiDaAggiungere.forEach((elemento, index) => elemento.cibo.findIndex((cibo => cibo.name == prodottiDaAggiungere[index].cibo))
    if(index != -1){
      cartTemp.cart[index].quantity! += 1
    } else {
      ciboDaAggiungere.quantity = 1;
      cartTemp.cart.push(ciboDaAggiungere)
    }
    this.carrello.next(cartTemp)
  }*/

  decrementCounter(ciboDaRimuovere: Cibo){
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == ciboDaRimuovere.name)
    if(index != -1 && cartTemp.cart[index].quantity! > 1){
      cartTemp.cart[index].quantity! -= 1
    } else if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != ciboDaRimuovere.name)
    }
    this.carrello.next(cartTemp)
  }

  decrementCounter2(bevandaDaRimuovere: Bevanda){
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == bevandaDaRimuovere.name)
    if(index != -1 && cartTemp.cart[index].quantity! > 1){
      cartTemp.cart[index].quantity! -= 1
    } else if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != bevandaDaRimuovere.name)
    }
    this.carrello.next(cartTemp)
  }

  decrementCounter3(dolceDaRimuovere: Dolce){
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == dolceDaRimuovere.name)
    if(index != -1 && cartTemp.cart[index].quantity! > 1){
      cartTemp.cart[index].quantity! -= 1
    } else if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != dolceDaRimuovere.name)
    }
    this.carrello.next(cartTemp)
  }

  removeCibo(ciboDaRimuovere: Cibo){
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == ciboDaRimuovere.name)
    if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != ciboDaRimuovere.name)
      this.carrello.next(cartTemp)
    }
  }

  removeCibo2(bevandaDaRimuovere: Bevanda){
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == bevandaDaRimuovere.name)
    if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != bevandaDaRimuovere.name)
      this.carrello.next(cartTemp)
    }
  }
  // resetCountersGeneral(){
  //   this.counters = this.counters.map(() => 0);
  //   this.counterSubject.next(this.counters);
  // }

  // resetCounterProdotto(id: number){
  //   this.counters[id] = 0;
  //   this.counterSubject.next(this.counters);
  // }
}
