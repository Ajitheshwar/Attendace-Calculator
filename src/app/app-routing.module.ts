import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './login.guard';
import { LoginacComponent } from './loginac/loginac.component';

const routes: Routes = [
  { path : 'login', component : LoginacComponent},
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate : [LoginGuard]},
  { path : '', pathMatch : "full", redirectTo : '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
