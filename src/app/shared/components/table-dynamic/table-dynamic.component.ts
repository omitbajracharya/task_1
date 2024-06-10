import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Pipe({
  name: 'typeof',
})
export class TypeofPipe implements PipeTransform {
  transform(value: unknown): unknown {
    return typeof value;
  }
}

@Component({
  selector: 'app-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styleUrls: ['./table-dynamic.component.css'],
})
export class TableDynamicComponent implements OnInit {
  private readonly searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  public searchData = '';
  public hideHeading = false;
  @Output() emitData: EventEmitter<Record<string, unknown>> = new EventEmitter<
    Record<string, unknown>
  >();
  @Input() columns: TTableComponent[] = [];
  @Input() data: unknown[] = [];
  // @Output() output: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((results) => {
        this.searchData = results;
        this.emitData.emit({ searchData: this.searchData });
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
