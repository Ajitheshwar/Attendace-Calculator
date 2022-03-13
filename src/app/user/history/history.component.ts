import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


  constructor(private data : DataService, private router : Router) { }

  ngOnInit(): void {

    this.data.historyObservable.subscribe(
      {
        next : data => {
          this.history = data
        }
      }
    )
    this.week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    this.month = ["January","February",'March','April','May','June','July','August','September','October','November','December']
   
  }

  history : any[] = []
  errDate : boolean = false
  errDateDes : string = ''
  month : string[] = []
  week : string[] = []
  yy = new Date().getFullYear()

  calculatePercentage(y : any)
  {
    if(y.subjectTotal + y.total == 0)
      return 100
    else  
      return Math.trunc(100*(y.subjectAttended + y.attended) / (y.subjectTotal + y.total))
  }

  dateSubmit(dateForm : NgForm)
  {
    this.errDate=false
    let date = dateForm.value.date
    let month = dateForm.value.month
    if(month==1 || month==3 || month==5 ||month==7 || month==8 || month==10 || month==12)
    {
      if(date<1 || date>31 )
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 31 for "+this.month[month-1]
      }
    }
    else if(month==4 ||month==6 ||month==10 ||month==11)
    {
      if(date<1 || date>30 )
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 30 for "+this.month[month-1]
      }
    }
    else if(month==2 )
    {
      if((date<1 || date>28 )&& this.yy%4!=0)
      {
        this.errDate = true
        this.errDateDes = "Date must be between 1 and 28 for "+this.month[month-1]
      }
      else if((date<1 || date>28 )&& this.yy%4==0)
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
    let date1 = new Date(this.yy,month-1,date)

    if(today<date1)
    {
      this.errDate = true
      this.errDateDes = "You can have history of date before "+today.getDate()+"-"+this.month[today.getMonth()]+"-"+today.getFullYear()+" "+this.week[today.getDay()]
    }
    if(!this.errDate)
    {
      let x = date+'-'+month+'-'+this.yy+' '+this.week[date1.getDay()]
      let y = false
      for(let h of this.history)
      {
        if(h.date==x)
        {
          y = true
          break
        }
      }
      if(!y)
      {
        this.errDate = true
        this.errDateDes="Attendance of "+x+" is cleared"
      }
      //console.log(x)
      document.getElementById(x)?.scrollIntoView()
    }
  }

  clearHistory()
  {
    this.data.clearHistory().subscribe(
      {
        next : data =>{ 
          alert(data.message)
          if(data.message=='Login to Continue!!!')
            {
              this.router.navigateByUrl("/login")
            }
          else
            this.data.updateHistory([])
        },
        error : err => { console.log("error in deleting history : "+err)}
      }
    )
  }
}
