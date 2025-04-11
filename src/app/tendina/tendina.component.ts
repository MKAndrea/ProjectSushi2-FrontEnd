import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDeleteService } from '../../services/edit-delete.service';

@Component({
  selector: 'app-tendina',
  imports: [CommonModule],
  templateUrl: './tendina.component.html',
  styleUrl: './tendina.component.css'
})
export class TendinaComponent implements OnInit{
  constructor(private editDeleteService: EditDeleteService){

  }

  isDropDownVisible = false;
  dropdownPosition = {top: "400px", left: "400px"};

  ngOnInit(): void {
    this.editDeleteService.isDropdownVisible$.subscribe(visible => {
      this.isDropDownVisible = visible;
    });

    this.editDeleteService.dropdownPosition$.subscribe(position => {
      this.dropdownPosition = position;
    });
  }
  
}


