import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../login.guard';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { AddTimetableComponent } from './add-timetable/add-timetable.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { HistoryComponent } from './history/history.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { MarksComponent } from './marks/marks.component';
import { ProfileComponent } from './profile/profile.component';
import { ShowAttendanceComponent } from './show-attendance/show-attendance.component';
import { TimetableComponent } from './timetable/timetable.component';
import { UserComponent } from './user.component';

const routes: Routes = [{ path: ':id', component: UserComponent,children : [
                          {path : 'profile',component : ProfileComponent},
                          {path : 'marks', component : MarksComponent, children : [
                            {path : 'addMarks', component : AddMarksComponent}
                          ]},
                          {path : 'attendance', component : AttendanceComponent, children : [
                            {path : 'showAttendance',component : ShowAttendanceComponent},
                            {path : 'history', component : HistoryComponent},
                            {path : 'timetable',component : TimetableComponent, children : [
                              {path : 'addTimeTable', component : AddTimetableComponent}
                            ]},
                            {path : 'postAttendance',component : MarkAttendanceComponent},
                          ]}]
                        }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
