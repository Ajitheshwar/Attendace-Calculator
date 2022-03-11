import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-marks',
  templateUrl: './add-marks.component.html',
  styleUrls: ['./add-marks.component.css']
})
export class AddMarksComponent implements OnInit {

  constructor(private data : DataService, private router : Router) { }

  ngOnInit(): void {
    this.varTitle = false
    this.errSubjectMarks = false
    this.varButtons = false
    this.varAllowSubmitMarks = false
  }

  title : string = ''
  varTitle : boolean = false
  marks : any[] = []
  errSubjectMarks : boolean = false
  varSemester : boolean = false
  varButtons : boolean = false
  varAllowSubmitMarks : boolean = false
  SGPA = 0
  
  
  navigateToMarks()
  {
    let id = localStorage.getItem("id");
    this.router.navigateByUrl('/user/'+id+'/marks')
  }

  allowEditTitle()
  {
    this.varTitle = false
  }

  submitTitle(value : any)
  {
    this.varTitle = true
    this.title = value.title
    this.varButtons = true
  }

  deleteMarks(i : any)
  {
    this.marks.splice(i,1)
  }

  allowSubmitMarks()
  {
    this.SGPA = 0
    this.varAllowSubmitMarks = true
    this.varSemester = false
    this.marks = []
  }

  allowSubmitSemesterMarks()
  {
    this.SGPA = 0
    this.varAllowSubmitMarks = true
    this.varSemester = true
    this.marks=[]
  }

  submitSGPA(value : any)
  {
    this.SGPA = value.SGPA
  }

  submitMarks(ref : NgForm)
  {
    let value = ref.value
    //console.log(value)
    this.errSubjectMarks = false
    if(value.total<value.marks)
    {
      this.errSubjectMarks = true
    }
    else
    {
      this.marks.push(value)
      //console.log(this.marks)
      ref.reset()
    }
  }

  submitSemesterMarks(ref : NgForm)
  {
    let value =  ref.value
    //console.log(value)
    this.errSubjectMarks = false
    if(value.gradepoints<1 || value.gradepoints>10)
    {
      this.errSubjectMarks = true
    }
    else
    {
      value.gradepoints = Math.trunc(value.gradepoints)
    }
    let obj = {subject : value.subject, marks : value.gradepoints, total : 10}
    this.marks.push(obj)
    //console.log(this.marks)
    ref.reset()
  }

  updateMarks()
  {
    if(window.confirm(`Do you want to add ${this.title} Marks`))
    {
      let obj = {title : this.title , marks : this.marks,semester : this.varSemester, SGPA : this.SGPA}
      //console.log(obj)
      this.data.setMarks(obj).subscribe(
        {
          next : data=>{
            alert(data.message)
            if(!data.var)
            {  
              this.data.updateMarks(data.data)
            }
            else
            {
              this.data.updateSemesterMarks(data.data)
            }
          },
          error : err=>{ console.log("error in updating marks : "+err)}
        }
      )
    }
  }
}
