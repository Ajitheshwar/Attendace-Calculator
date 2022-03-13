import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DataService } from './user/data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router : Router , private ds : DataService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      let token = localStorage.getItem("token")
      let id = localStorage.getItem("id")
      if(id == undefined || token == undefined)
      {
        this.router.navigateByUrl('/login')
        return false;
      }
      else
      {
        return true
      }
  }
 
}
