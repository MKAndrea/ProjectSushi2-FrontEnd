import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditDeleteService {

  constructor() { }

  private dropdownVisibleSubject = new BehaviorSubject<boolean>(false);
  private dropdownPositionSubject = new BehaviorSubject<{ top: string, left: string }>({ top: '0px', left: '0px' });

  isDropdownVisible$ = this.dropdownVisibleSubject.asObservable();
  dropdownPosition$ = this.dropdownPositionSubject.asObservable();

  showTendina(event: MouseEvent): void{
    const clickX = event.pageX
    const clickY = event.pageY

    // Aggiorna i valori nel servizio
    this.dropdownPositionSubject.next({ top: `${clickY}px`, left: `${clickX}px` });
    this.dropdownVisibleSubject.next(!this.dropdownVisibleSubject.value);
  }
}
