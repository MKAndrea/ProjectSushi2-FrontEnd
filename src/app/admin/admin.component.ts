import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  username: string = '';
  password: string = '';
  isLogged = false;

  constructor(private menuService: MenuService, private router: Router){

  }

  ngOnInit(): void {
    this.isLogged = this.menuService.getIslogged();
  }

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    if(this.username == "admin" && this.password == "adminpass"){
      //console.log("Password corretta e username corretto")
      this.menuService.setIsAdmin(true);
      this.router.navigate(['/gestione']);
      alert("Password and Username correct!")
      this.username = "";
      this.password = "";
      this.isLogged = true;
      this.menuService.setIslogged(true);
    }
    else{
      //console.log("Wrong Password!");
      alert("Wrong Password! Try again")
      this.username = "";
      this.password = "";
    }
  }

  goBack(){
    this.router.navigate(['']);
  }
  
}
