import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNonrendu]'
})
export class Nonrendu {

  constructor(el: ElementRef) {
    const n = el.nativeElement;
    n.style.color = "red";
    n.style.border = "2px solid red";
   }

}
