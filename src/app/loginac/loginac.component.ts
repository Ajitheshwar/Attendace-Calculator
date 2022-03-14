import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../user/data.service';

@Component({
  selector: 'app-loginac',
  templateUrl: './loginac.component.html',
  styleUrls: ['./loginac.component.css']
})
export class LoginacComponent implements OnInit {

  constructor( private router : Router, private data :DataService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.newUser = false
    this.changePassword = false
  }

  changePassword = false
  login : boolean = true
  newUser : boolean = false

  allowSignUp()
  {
    this.newUser = true;
    //console.log(this.newUser)
  }

  allowLogin()
  {
    this.newUser = false
    this.changePassword = false
    //console.log(this.newUser)
  }

  submitForm(ref : NgForm)
  {
    let obj = {newUser : this.newUser,changePassword : this.changePassword, data : ref.value}
    this.data.loginSignUp(obj).subscribe(
      {
        next : data => {
          if(this.newUser)
          {
            if(data.message=="User created successfully!!!")
            {
              this.toastr.success(data.message,"Success")
            }
            else
            {
              this.toastr.warning(data.message,"Warning")
            }
          }
          else
          {
            if(data['message']=='Logged In Successfully')
            {
              this.toastr.success(data.message,"Success")
              localStorage.setItem("token",data.token)
              let id = data.id
              this.login = false
              localStorage.setItem("id",id)
              this.router.navigateByUrl("user/"+id)
            }
            else
            {
              if(data.message=="Password Changed Succesfully!!!")
              {
                this.toastr.success(data.message,"Success")
              }
              else
              {
                this.toastr.warning(data.message,"Warning")
              }
              this.changePassword = false
            }

          }
        }
      }
    )
  }
}
