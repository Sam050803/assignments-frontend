import { Component } from '@angular/core';
import { Assignments } from '../../assignments/assignments';

@Component({
  selector: 'app-home',
  imports: [Assignments],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
