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
  
    let id = localStorage.getItem("id")
    this.ds.getUserInfo(id).subscribe(
    {
      next : data=>{
        console.log(data)
        this.ds.updateSubjects(data.message.subjects)
        this.ds.updateTimeTable(data.message.timetable)
        this.ds.updateHistory(data.message.history)
        this.ds.updateMarks(data.message.marks)
        this.ds.updateSemesterMarks(data.message.semester)
        this.ds.updateLinks(data.message.links)
        this.ds.updateNotes(data.message.notes)
        this.ds.updateUserDetails(data.message.userDetails)
        this.router.navigateByUrl("/user/"+id+"/profile")
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
