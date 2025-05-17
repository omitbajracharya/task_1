import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataSharingService {
  private dataSubject = new BehaviorSubject<any>(null);
  getData = this.dataSubject.asObservable();

  constructor() {}

  setData(data: any) {
    this.dataSubject.next(data);
  }
}
