import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  constructor(private data : DataService, private router : Router) { }

  ngOnInit(): void {
    let id = localStorage.getItem("id")
    this.router.navigateByUrl("/user/"+id+"/attendance/showAttendance")
  }

}
