import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { DataService } from './user/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'attendance-calculator';

  constructor(private router : Router,private data : DataService){}
}
