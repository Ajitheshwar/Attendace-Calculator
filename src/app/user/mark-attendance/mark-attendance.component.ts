import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.css']
})
export class MarkAttendanceComponent implements OnInit {

  constructor(private data : DataService,private router : Router,private toastr : ToastrService) { }


  ngOnInit(): void {

    this.week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    this.month = ["January","February",'March','April','May','June','July','August','September','October','November','December']
   
    this.date = ''
    this.errDate = false
    this.errDateDes = ''
    this.y = false
    this.todayDate()

    this.data.timetableObservable.subscribe(
      { 
        next : data => {
          this.timetable = data
          if(this.timetable.length == 0)
          {
            this.hasTimeTable = false
          }
          else
          {
            this.hasTimeTable = true
          }
        }
      }
    )

    this.data.subjectsObservable.subscribe(
      { next : data => {this.totalSubjects = data}}
    )

    this.data.historyObservable.subscribe(
      {
        next : data => { this.history = data}
      }
    )

  }

  history : any[] = []
  hasTimeTable : boolean = false
  totalSubjects : any[] = []
  week :string[] = []  
  month :string[]  = [] 
  date = ''
  today = false
  dd=new Date().getDate()
  mm=new Date().getMonth()
  yy = new Date().getFullYear()
  day = new Date().getDay()
  errDate = false
  errDateDes = ''
  timetable :any[] = []
  subjects : any[] = []
  y = false;
  subjectAttendance : boolean = false
  errSubAttd : boolean = false 
  errSubAttdDesc : string[] = []
  inHistory : boolean = false


  checkHistory()
  {
    this.inHistory = false
    for(let x of this.history)
    {
      if(x.date === this.date)
        this.inHistory = true
    }
  }

  allowSubjectAttendance()
  {
    this.subjectAttendance = true
    this.dd=new Date().getDate()
    this.mm=new Date().getMonth()
    this.yy = new Date().getFullYear()
    this.day = new Date().getDay()
  }

  submitSubjectAttendance(ref4 : NgForm)
  {
    this.errSubAttd = false
    this.errSubAttdDesc = []
    let obj = ref4.value
    let obj2 = []
    for (let x in obj)
    {
      let y = {subject : '',attended : 0,total : 0,subjectAttended : 0, subjectTotal : 0}
      y.subject = x.slice(0,x.length-1)
      if(x[x.length-1]=='1')
      {
        if(obj[x]!="")
          y.attended= obj[x];
        obj2.push(y)
      }
      else
      {
        if(obj[x]!="")
          obj2[obj2.length-1].total = obj[x] 
        else if (obj2[obj2.length-1].attended > 0 && obj[x]=="")
          obj2[obj2.length-1].total = 0

        if(obj2[obj2.length-1].total < obj2[obj2.length-1].attended)
        {
          this.errSubAttd = true;
          this.errSubAttdDesc.push(y.subject)
        }
      }
       
    }
    if(!this.errSubAttd)
    {
      obj = { date : this.dd+'-'+(this.mm+1)+'-'+this.yy+' '+this.week[this.day],attendance : obj2 }
      //console.log(obj)
      this.data.postAttendance(obj).subscribe(
        {
          next : data =>{
                    this.toastr.success(data.message,"Success")
                   this.data.updateSubjects(data.data.subjects)
                   this.data.updateHistory(data.data.history)
                 },
         error : err=>{console.log("err in posting attendance : "+err)}
       }
     )
    }
  }

  getSubjectList(day : number)
  {
    this.subjects = []
    for(let obj of this.timetable)
    {
      if(obj.day == day)
        this.subjects = obj.ddtt
    }
    if(this.subjects.length==0)
    {
      this.errDate = true
      this.errDateDes = "No Time table for given day"
    }
    else
    {
      this.y=true
    }
  }

  allowPrevious()
  {
    this.inHistory = false
    this.subjectAttendance = false
    this.today = false
    this.date=''
    this.subjects = []
    this.y = false
    this.errDate = false
  }

  todayDate()
  {
    this.today = true
    this.subjectAttendance = false
    this.dd=new Date().getDate()
    this.mm=new Date().getMonth()
    this.yy = new Date().getFullYear()
    this.day = new Date().getDay()
    this.date = this.dd+'-'+(this.mm+1)+'-'+this.yy+' '+this.week[this.day]
    this.getSubjectList(this.day)
    this.checkHistory()
  }

  dateSubmit(dateForm : NgForm)
  {
    this.y = false
    this.errDate=false
    let month = dateForm.value.month
    if(month==1 || month==3 || month==5 ||month==7 || month==8 || month==10 || month==12)
    {
      if(dateForm.value.date<1 || dateForm.value.date>31 )
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 31 for "+this.month[month-1]
      }
    }
    else if(month==4 ||month==6 ||month==10 ||month==11)
    {
      if(dateForm.value.date<1 || dateForm.value.date>30 )
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 30 for "+this.month[month-1]
      }
    }
    else if(month==2 )
    {
      if((dateForm.value.date<1 || dateForm.value.date>28 )&& this.yy%4!=0)
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 28 for "+this.month[month-1]
      }
      else if((dateForm.value.date<1 || dateForm.value.date>28 )&& this.yy%4==0)
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 29 for "+this.month[month-1]
      }
    }
    else
    {
      this.errDate = true
      this.errDateDes = "Month must be between 1 and 12";
    }
    let today = new Date()
    let previous = new Date (dateForm.value.year,month-1,dateForm.value.date)
    if(today <= previous)
    {
      //console.log(today)
      //console.log(previous)
      this.errDate = true;
      this.errDateDes = "You can only mark attendance for previous days i.e before "+ today.getDate()+"-"+(today.getMonth()+1) +"-"+ today.getFullYear()+" "+this.week[today.getDay()]
    }
    if(!this.errDate)
    {
      this.day = new Date(this.yy,month-1,dateForm.value.date).getDay()
      this.dd = dateForm.value.date
      this.yy = dateForm.value.year
      this.mm = month-1
      this.date = this.dd+'-'+(this.mm+1)+'-'+this.yy+' '+this.week[this.day]
      this.getSubjectList(this.day)
      this.checkHistory()
    }
  }

  postAttendance(ref2 : NgForm)
  {
    //console.log(this.dd,this.mm,this.yy)
    let att = []
    for(let x in ref2.value)
    {
      let obj1 = {subject : x, attended : 0, total : 1,subjectAttended : 0, subjectTotal : 0}
      if(ref2.value[x]==true)
      {
        obj1.attended = 1;
      }
      att.push(obj1);
    }
    let obj = { date : this.dd+'-'+(this.mm+1)+'-'+this.yy+' '+this.week[this.day],attendance : att}

    this.data.postAttendance(obj).subscribe(
       {
         next : data =>{
                  this.toastr.success(data.message,"Success")
                  if(data.message=='Login to Continue!!!')
                  {
                    this.router.navigateByUrl("/login")
                  }
                  else
                  {
                    this.data.updateSubjects(data.data.subjects)
                    this.data.updateHistory(data.data.history)
                  }
                },
        error : err=>{console.log("err in posting attendance : "+err)}
      }
    )

  }
}
