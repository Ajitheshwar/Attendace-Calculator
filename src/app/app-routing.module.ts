import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './login.guard';
import { LoginacComponent } from './loginac/loginac.component';

const routes: Routes = [
  { path : 'login', component : LoginacComponent},
  { path: 'user', canActivate : [LoginGuard], loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path : '**', pathMatch : "full", redirectTo : '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
