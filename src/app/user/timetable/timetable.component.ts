import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor( private data : DataService,private router : Router) { }

  ngOnInit(): void {
    
    this.data.timetableObservable.subscribe(
      { 
        next : data => {
          if(data.length== 0)
          {
            this.str = 'Add Time Table'
          }
          else
          {
            this.timeTable = data
            this.str = 'Edit Time Table'
          }
        }
      }
    )

    this.week=["Sunday","Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday"]
  }

  str : string = ""
  timeTable :any[] = []
  edit : boolean = false
  week : string[] = []

  navigateToTimetable()
  {
    this.edit = false
    this.router.navigateByUrl('/user/attendance/timetable')
  }
}
