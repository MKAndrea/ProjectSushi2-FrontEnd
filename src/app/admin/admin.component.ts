import { Component } from '@angular/core';
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
export class AdminComponent {
  username: string = '';
  password: string = '';

  constructor(private menuService: MenuService, private router: Router){

  }
  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    if(this.username == "admin" && this.password == "adminpass"){
      //console.log("Password corretta e username corretto")
      this.menuService.setIsAdmin(true);
      this.router.navigate(['']);
      alert("Password and Username correct!")
      this.username = "";
      this.password = "";
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
