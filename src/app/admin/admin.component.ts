import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    if(this.username == "admin" && this.password == "adminpass"){
      console.log("Password corretta e username corretto")
    }
    else{
      console.log("Password errata");
    }
  }
  
}
