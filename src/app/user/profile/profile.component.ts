import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private data : DataService,private router : Router, private toastr : ToastrService) { }

  ngOnInit(): void {
    console.log(this.userDetails)

    this.data.subjectsObservable.subscribe(
      {
        next : data => {
          if(data.length==0)
          {
            this.hasSubjects = false
          }
          else
          {            
            let sum = 0
            for(let x of data)
            {
              if(x.total == 0)
                sum = sum + 100
              else
                sum= sum + Math.trunc(x.attended*100/x.total)
            }
            this.percentage = Math.trunc(sum/data.length)
            this.hasSubjects = true
          }
        }
      }
    )

    this.data.semesterMarksObservable.subscribe(
      {
        next : data => {
          //console.log(data)
          this.CGPA = 0
          if(data.length>0)
          {              
            let l=0
            for(let x of data)
            {
              this.CGPA = this.CGPA + x.SGPA
              l++
            }
            this.CGPA = Math.trunc(this.CGPA*100/l)/100
          }
        }
      }
    )

    this.data.linksObservable.subscribe(
      {
        next : data => { this.links = data},
        error : err=>{console.log("error in subscribing links " +err)}
      }
    )

    this.data.notesObservable.subscribe(
      {
        next : data=>{this.notes = data},
        error : err => { console.log("error in subscribing notes : " +err)}
      }
    )
    this.editDetails = false
    this.data.userDetailsObervable.subscribe({
      next : data => { this.userDetails= data},
      error : err => { console.log("error in user details : "+err)}
    })
  }

  editDetails : boolean = false
  isLink : boolean = true
  CGPA : number = 0
  percentage : number = 0
  hasSubjects : boolean = true
  links : any[] = [{name : "ajith", url : "https://getbootstrap.com/docs/5.1/layout/gutters/#horizontal--vertical-gutters"},{name : "ajith", url : "abcd"},{name : "ajith", url : "abcd"},{name : "ajith", url : "abcd"},]
  notes : any[]= ["Ajith is a good boy Ajith is a good boy Ajith is a good boy Ajith is a good boy Ajith is a good boy ","Ajith is a good boy Ajith is a good boy Ajith is a good boy Ajith is a good boy Ajith is a good boy ","Ajith is a good boy Ajith is a good boy Ajith is a good boy Ajith is a good boy Ajith is a good boy "]
  userDetails = {college : "", rollno : "", bio : "", name : ""}

  deleteNote(i : any)
  {
    let obj = {edit : false, isLink : false, delete : true, index : i}
    this.data.deleteLinkNote(obj).subscribe(
      {
        next : data => {
          this.toastr.info(data.message,"Info")
          this.data.updateNotes(data.data)
        },
        error : err=> {console.log("error in deleting notes "+ err)}
      }
    )
  }

  deleteLink(i : any)
  {
    if(window.confirm(`Do you want to delete link${this.links[i].name}?`))
    {
      let obj = {edit : false, isLink : true, delete : true, index : i}
      this.data.deleteLinkNote(obj).subscribe(
        {
          next : data => {
            this.toastr.info(data.message,"Info")
            this.data.updateLinks(data.data)
          },
          error : err=> {console.log("error in deleting link "+ err)}
        }
      )
    }
  }


  submitForm(ref : any)
  {
    let obj = {edit : false, isLink : this.isLink,delete : false, data : ref.value}
    //console.log(obj)
    this.data.submitNoteLinkEdit(obj).subscribe(
      {
        next : data => 
        {
          if(data.message == "Login to Continue!!!")
          {
            this.toastr.info(data.message, "Info")
            this.router.navigateByUrl("/login")
          }
          else
          {
            this.toastr.success(data.message,"Success")
            if(this.isLink)
            {
              this.data.updateLinks(data.data)
            }
            else
            {
              this.data.updateNotes(data.data)
            }
          }
        },
        error : err => {console.log("error in updating note, link " + err)}
      }
    )
  }

  submitEditDetails(ref :any)
  {
    this.editDetails = false;
    let obj = { edit : true, data : ref.value}
    this.data.submitNoteLinkEdit(obj).subscribe(
      {
        next : data =>{
          this.toastr.success(data.message,"Success")
          this.data.updateUserDetails(data.data)
        }
      }
    )
  }

}
