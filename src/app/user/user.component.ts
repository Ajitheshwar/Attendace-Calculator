import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private ds : DataService, private router : Router) { }

  ngOnInit(): void {
  
    this.ds.getUserInfo(localStorage.getItem("id")).subscribe(
    {
      next : data=>{
        this.ds.updateSubjects(data.message.subjects)
        this.ds.updateTimeTable(data.message.timetable)
        this.ds.updateHistory(data.message.history)
        this.ds.updateMarks(data.message.marks)
        this.ds.updateSemesterMarks(data.message.semester)
      },
      error : err=>{console.log("error in getting timetable and subjects"+err)}
    }
    )
  }

  logOut()
  {
    localStorage.removeItem('id');
    localStorage.removeItem('token')
    this.router.navigateByUrl("");
  }
}
