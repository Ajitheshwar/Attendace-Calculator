import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http : HttpClient) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    // Get Token from browser storage 
    let token=localStorage.getItem("token")
    console.log(token)
    //Token existance
    if(token){

      // Add it to header of request object 
      let copyRequest=req.clone({
        headers : req.headers.set("Authorization", "Bearer "+token)
      })

      // pass request object to server
      return next.handle(copyRequest)
    }
    else{
      return next.handle(req)
    }
  }

  userDetails = new BehaviorSubject<any>([])
  userDetailsObervable = this.userDetails.asObservable()
  updateUserDetails(obj :any)
  {
    this.userDetails.next(obj)
  }

  links = new BehaviorSubject<any>([])
  linksObservable = this.links.asObservable()
  updateLinks(l : any)
  {
    this.links.next(l)
  }

  notes = new BehaviorSubject<any>([])
  notesObservable = this.notes.asObservable()
  updateNotes(n : any)
  {
    this.notes.next(n)
  }


  timetable = new BehaviorSubject<any>([])
  timetableObservable = this.timetable.asObservable()
  updateTimeTable(tt : any)
  {
    this.timetable.next(tt)
  }

  subjects = new BehaviorSubject<any>([])
  subjectsObservable = this.subjects.asObservable()
  updateSubjects(subs : any)
  {
    this.subjects.next(subs)
  }

  history = new BehaviorSubject<any>([])
  historyObservable = this.history.asObservable()
  updateHistory(hist : any)
  {
    this.history.next(hist)
  }

  marks = new BehaviorSubject<any>([])
  marksObservable = this.marks.asObservable()
  updateMarks(marks : any)
  {
    this.marks.next(marks)
  }

  semesterMarks = new BehaviorSubject<any>([])
  semesterMarksObservable = this.semesterMarks.asObservable()
  updateSemesterMarks (semester : any)
  {
    this.semesterMarks.next(semester)
  }

  loginSignUp(obj : any) : Observable<any>
  {
    return  this.http.post<any>("/login",obj)
  }

  setTimetable(tt : any,subs : any) : Observable<any>
  {
    this.updateTimeTable(tt)
    this.updateSubjects(subs)
    let uid = localStorage.getItem("id")
    let obj = {timetable : tt, subjects : subs}
    return this.http.put<any>("/user/"+uid+"/attendance/timetable/addTimeTable",obj)
  }

  getUserInfo(id : any) : Observable<any>
  {
    id = localStorage.getItem("id")
    return this.http.get<any>("/user/"+id)
  }

  postAttendance(obj : any) :Observable<any>
  {
    let uid = localStorage.getItem("id")
    let obj4 = {date : obj.date, attendance : obj.attendance}
    return this.http.put<any>("/user/"+uid+"/attendance/postAttendance",obj4)
  }



  clearHistory() :Observable<any>
  {
    let uid = localStorage.getItem("id")
    return this.http.put<any>("/user/"+uid+"/attendance/history",{})
  }

  setMarks(obj : any) :Observable<any>
  {
    let uid = localStorage.getItem("id")
    return this.http.put<any>("/user/"+uid+"/marks/addMarks",obj)
  }

  deleteMarks(i : any) : Observable<any>
  {
    let id = localStorage.getItem("id");
    //consolelog(i)
     return this.http.put<any>("user/"+id+"/marks",i)
  }

  submitNoteLinkEdit(obj : any) : Observable<any>
  {
    let id = localStorage.getItem("id")
    return this.http.put<any>("/user/"+id+"/profile",obj)
  }

    
  deleteLinkNote(obj : any) : Observable<any>
  {
    let id = localStorage.getItem("id")
    return this.http.put<any>("/user/"+id+"/profile",obj)
  }
}
