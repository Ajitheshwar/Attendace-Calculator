import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms'

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { AddTimetableComponent } from './add-timetable/add-timetable.component';
import { HistoryComponent } from './history/history.component';
import { MarksComponent } from './marks/marks.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { TimetableComponent } from './timetable/timetable.component';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { ShowAttendanceComponent } from './show-attendance/show-attendance.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    UserComponent,
    MarkAttendanceComponent,
    AddTimetableComponent,
    HistoryComponent,
    MarksComponent,
    AttendanceComponent,
    TimetableComponent,
    AddMarksComponent,
    ShowAttendanceComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }
