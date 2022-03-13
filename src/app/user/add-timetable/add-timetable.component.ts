import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-timetable',
  templateUrl: './add-timetable.component.html',
  styleUrls: ['./add-timetable.component.css']
})
export class AddTimetableComponent implements OnInit {

  constructor(private data : DataService, private router : Router) { }

  ngOnInit(): void {
    
    this.data.timetableObservable.subscribe(
      { next : data => {this.timetable = data}}
    )

    this.data.subjectsObservable.subscribe(
      { next : data => {
          this.subjects = data
          //console.log(this.subjects)
        }
      }
    )
    this.ddtt=[]
    this.x=this.y=this.submitSubject=this.submitddttvar=this.dayerror = this.tterror = false    
    this.day = -1
    this.tterrordes = ''
    this.suberr=false 
    this.week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    this.month = ["January","February",'March','April','May','June','July','August','September','October','November','December']
  }

  submitted2 : boolean = false
  week : string[] = []
  month : string[] = []
  subjects : any[]=[];
  timetable : any[] = []
  day : number = -1
  ddtt : any[] = []
  x :boolean = false
  y : boolean = false
  submitSubject : boolean = false
  submitddttvar : boolean = false
  dayerror : boolean = false
  tterror : boolean = false
  tterrordes=''
  suberr=false

  
  navigateToTimeTable()
  {
    let id = localStorage.getItem("id");
    this.router.navigateByUrl('/user/'+id+'/attendance/timetable')
  }

  deleteSubject(i : any)
  {
    this.subjects.splice(i,1)
  }

  addSubject(ref:any)
  {
    this.suberr = false
    if(ref.form.valid)
    {
      for(let s of this.subjects)
      {
        if(s.subject.toLowerCase()==ref.value.subject.toLowerCase())
          this.suberr = true;
      }
      if(!this.suberr)
      {
        let obj3 = { subject : ref.value.subject, attended : 0, total : 0}
        this.subjects.push(obj3)
        ref.reset()
        this.submitSubject=false
      }
    }
    else
    {
      this.submitSubject=true
    }
  }

  doneSubjects()
  {
    this.y=true;
  }

  allowddtt(ref : any)
  {
    if(ref.form.valid)
    {
      this.dayerror = false
      this.day = parseInt(ref.value.day)
      for(let obj of this.timetable)
      {
        if(obj.day==this.day)
        {
          this.dayerror=true
          break
        }  
      }
      if(!this.dayerror)
      {
        this.x=true
        this.submitddttvar=false
        this.dayerror=false
        this.submitted2 = false
      }
      else 
      {
        this.dayerror=true
      }
      //console.log(this.dayerror)
    }
    else
    {
      this.submitddttvar=true
    }
  }

  submitddtt(ref : NgForm)
  {
    let value = ref.value
    this.submitted2 = true
    this.tterror = false
    if(value.from>value.to)
    {
      this.tterror = true;
      this.tterrordes = "Error : Time 'to' cannot be before time 'from'"
    }
    else if(value.from==value.to)
    {
      this.tterror = true;
      this.tterrordes = "Error : Time 'to' and time 'from' must be different"
    }
    else
    {
      for(let obj of this.ddtt)
      {
        if(obj.subject==value.subject)
        {
          this.tterror = true
          this.tterrordes=`Error : Timings for ${obj.subject} is already added`
          break
        }
        if((value.from<obj.to && value.from>obj.from)||value.to<obj.to && value.to>obj.from)
        {
          this.tterror = true;
        }
        if(value.from==obj.from || value.to==obj.to)
        {
          this.tterror = true
        }
        if(this.tterror)
        {
          this.tterrordes = 'Error : Time table will have colliding timings if you add this timings'
          break;
        }
      }
      if(!this.tterror)
      {
        this.ddtt.push(value)
        ref.reset()
        this.submitted2 = false
      }
    }
  }

  deleteddtt(i:any)
  {
    this.ddtt.splice(i,1)
  }

  addTimeTable()
  {
    this.x=false
    let obj = {day : this.day, ddtt : this.ddtt}
    this.timetable.push(obj)
    this.timetable.sort((a,b)=>a.day - b.day)
    this.ddtt=[]
    //console.log(this.timetable)
  }

  deletett(i : any)
  {
    this.timetable.splice(i,1);
  }

  updateTimeTable()
  {
    if(window.confirm("Do you want to proceed with this timetable?"))
    {
      this.data.setTimetable(this.timetable,this.subjects).subscribe(
        {
          next : data =>{ 
            alert(data.message)
            if(data.message=='Login to Continue!!!')
            {
              this.router.navigateByUrl("/login")
            }
            else
            {
              this.navigateToTimeTable()
            }
          },
          error : err =>{console.log("error in updating time table : "+err)}
        },
        
      )
    }
  }
}