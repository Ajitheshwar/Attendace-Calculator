import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private data : DataService) { }

  ngOnInit(): void {
    this.percentage = 63

    this.data.subjectsObservable.subscribe(
      {
        next : data => {
          //console.log(data)
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
  }

  CGPA : number = 0
  percentage : number = 0
  hasSubjects : boolean = true
}
