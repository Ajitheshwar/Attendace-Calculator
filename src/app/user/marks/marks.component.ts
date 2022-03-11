import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.css']
})
export class MarksComponent implements OnInit {

  constructor(private router : Router,private data : DataService) { }

  ngOnInit(): void {
    this.getSemesterMarks()
    this.getNormalMarks()
  }
  addMarks : boolean = false
  marks : any[] = []
  varSemester : boolean = false

  getNormalMarks()
  {
    this.data.marksObservable.subscribe(
      {
        next : data =>{
          this.marks=data
          this.varSemester = false;
        }
      }
    )
    this.addMarks = false
  }

  getSemesterMarks()
  {
    this.data.semesterMarksObservable.subscribe(
      {
        next : data =>{
          this.marks=data
          this.varSemester = true;
        }
      }
    )
    this.addMarks = false
  }

  deleteMarks(i : any)
  {
    if(window.confirm(`Do you want to delete ${this.marks[i].title} Marks?`))
    {        
      let obj = {varSemester : this.varSemester, index : i}
      this.data.deleteMarks(obj)
    }
  }
}
