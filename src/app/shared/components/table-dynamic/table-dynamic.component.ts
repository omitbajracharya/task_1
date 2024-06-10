import { Component, EventEmitter, Input,Output, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Pipe({
  name: "typeof"
})
export class TypeofPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return typeof value;
  }
}

@Component({
  selector: 'app-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styleUrls: ['./table-dynamic.component.css']
})
export class TableDynamicComponent implements OnInit {
  constructor() { }
  private readonly searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  public searchData: string = '';
  public hideHeading: boolean = false;
  @Output() emitData:EventEmitter<{[key:string]:any}>= new EventEmitter<{[key:string]:any}>();
  @Input() columns:TTableComponent[] = [];
  @Input() data: any[] = [];
  // @Output() output: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((results) => {
      this.searchData = results;
      this.emitData.emit({searchData:this.searchData});
    });
  }

  // public emitData(): void {
  //   let data = {}
  //   this.output.emit(data);
  // }

  public onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }
 
}


