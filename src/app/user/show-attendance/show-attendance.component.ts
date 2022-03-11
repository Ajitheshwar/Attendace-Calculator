import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-show-attendance',
  templateUrl: './show-attendance.component.html',
  styleUrls: ['./show-attendance.component.css']
})
export class ShowAttendanceComponent implements OnInit {

  constructor(private data : DataService) { }

  ngOnInit(): void {

    this.data.subjectsObservable.subscribe(
      {
        next : data=>{this.subjects = data}
      }
    )
  }

  subjects : any[] = []

  calculatePercentage(attended : number, total : number)
  {
    if(total==0)
      return 100
    else
      return Math.trunc(100*attended/total)
  }
}
