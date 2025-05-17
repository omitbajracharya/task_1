import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService.service';
import { IdentityDto, MitraERPAuthService } from 'src/app/core/services/mitraerp_auth.service';
import { SharedFiscalYearService } from '../services/shared-fiscal-year.service';

declare var NepaliFunctions: any;
declare global {
  interface HTMLElement { 
    nepaliDatePicker(): void;
  }
}

export interface IDateADBS {
  fromDate?: string,
  toDate?: string,
  fromMiti?: string,
  toMiti?: string,
  [key: string]: any; 
}

export interface DynamicField {
  name: string;
  type: 'text' | 'select' | 'number' | 'date' | 'checkbox';
  label: string;
  required?: boolean;
  options?: any[]; // For select fields
  bindLabel?: string; // For select fields
  bindValue?: string; // For select fields
}

@Component({
  selector: 'app-set-date-call-api',
  templateUrl: './set-date-call-api.component.html',
  styleUrl: './set-date-call-api.component.scss'
})
export class SetDateCallApiComponent implements OnInit, OnChanges{
  @Output() emitData = new EventEmitter<IDateADBS>();
  @Input() dynamicFields: DynamicField[] = [];
  @Input() dynamicFieldExist: boolean = false;
  @Input() loadInitial: boolean = true;
  _currentUser: IdentityDto | null;
  inputForm: FormGroup;
  currentDate: any;
  currentNepaliYear: string = '';
  currentNepaliMonth: string = '';
  currentNepaliDate: string = '';

  fiscalYearInADBeginning: string = '';
  fiscalYearInADEnd: string = '';
  fiscalYearInBSBeginning: string = '';
  fiscalYearInBSEnd: string = '';
  firstTimeApiCallAutomatic = true;

   constructor(
      public _commonService: CommonService,
      private fb: FormBuilder,
      private datePipe: DatePipe,
      private router: Router,
      private _authService: MitraERPAuthService,
      private sharedFiscalYearService: SharedFiscalYearService
    ) {
      
    }
    
    ngOnChanges(changes: SimpleChanges): void {
      if (changes["dynamicFields"]) {
        this.updateFormControls();
      }
    }
    
    private updateFormControls() {
      // Remove existing dynamic controls
      this.dynamicFields.forEach(field => {
        if (this.inputForm.contains(field.name)) {
          this.inputForm.removeControl(field.name);
        }
      });
    
      // Add new controls
      this.dynamicFields.forEach(field => {
        this.inputForm.addControl(
          field.name,
          this.fb.control(null, field.required ? Validators.required : null)
        );
      });
    }
  
    ngOnInit(): void {
      // Initialize form with fixed date controls
    const formGroupConfig: Record<string, any> = {
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      fromMiti: [null, [Validators.required]],
      toMiti: [null, [Validators.required]],
    };

    // Safely add dynamic controls
    if (this.dynamicFields && Array.isArray(this.dynamicFields)) {
      this.dynamicFields.forEach(field => {
        if (field.name && typeof field.name === 'string') {
          // Skip if control already exists to prevent duplicates
          if (!formGroupConfig[field.name]) {
            formGroupConfig[field.name] = [
              null, 
              field.required ? Validators.required : null
            ];
          } else {
            console.warn(`Form control '${field.name}' already exists and won't be overwritten`);
          }
        } else {
          console.error('Invalid field configuration:', field);
        }
      });
    } else {
      console.warn('dynamicFields is not a valid array');
    }
    this.inputForm = this.fb.group(formGroupConfig);
      const today = new Date();
      this.currentDate = today.toISOString().split('T')[0]; 
      this.currentNepaliDate = NepaliFunctions.BS.GetCurrentDate(today);
      ;
      this.setFiscalDate();
      
      this.sharedFiscalYearService.selectedFiscal$.subscribe((date:any)=> {
        this.setFiscalDate();
      })     
    }

    initializeToMiti() {
      $('#nepali-datepicker-to3').data('nepali-date-picker', null);
      const toMiti = document.getElementById("nepali-datepicker-to3") as HTMLInputElement;
    
      if (toMiti) {
        (toMiti as any).nepaliDatePicker({
          onChange: () => {
            const _miti = $("#nepali-datepicker-to3").val();
            const _date = NepaliFunctions.BS2AD(_miti, "YYYY-MM-DD", "yyyy-MM-dd");
    
            this.inputForm.patchValue({ 
              toDate: _date, 
              toMiti: _miti // ensure this is updated too
            });
    
            this.initializeFromMiti();
          },
          disableBefore: this.inputForm.value.fromMiti || this.fiscalYearInBSBeginning,
          disableAfter: this.fiscalYearInBSEnd
        });
      } else {
        console.error('Element with id "nepali-datepicker-to3" not found.');
      }
    }
    

    initializeFromMiti() {
      $('#nepali-datepicker4').data('nepali-date-picker', null);
      const fromMiti = document.getElementById("nepali-datepicker4") as HTMLInputElement;
    
      if (fromMiti) {
        (fromMiti as any).nepaliDatePicker({
          onChange: () => {
            const _miti = $("#nepali-datepicker4").val();
            const _date = NepaliFunctions.BS2AD(_miti, "YYYY-MM-DD", "yyyy-MM-dd");
    
            this.inputForm.patchValue({ 
              fromDate: _date, 
              fromMiti: _miti 
            });
    
            this.initializeToMiti();
          },
          disableBefore: this.fiscalYearInBSBeginning,
          disableAfter: this.inputForm.value.toMiti || this.fiscalYearInBSEnd
        });
      } else {
        console.error('Element with id "nepali-datepicker4" not found.');
      }
    }

    setFiscalDate() {
      this._currentUser = this._authService.getCurrentIdentityData();  
      const fiscalYear = this._currentUser?.fiscalYear;
    if (fiscalYear) {
      // Extract the fiscal year start and end from the format (e.g., '2081/082')
      const [startYear, endYear] = fiscalYear.split('/');
      
      // 
      let fromBS = `${startYear}-04-01`; 
      const nextyear = Number(startYear) + 1;
      const monthDays = this._commonService.getTotalDaysInNepaliMonth(nextyear.toString(), 3) ?? '31';
      let toBS = `${parseInt(startYear) + 1}-03-${monthDays}`; 
     /**check toBs is set to future Date*/
      const [year, month, day] = fromBS.split('-').map(Number); // Split and convert to numbers
     
      const [currentYear,currentMonth,currentDay] = this.currentNepaliDate.split('-').map(Number); 
      // check future dates for fromMiti
      const today = new Date();
      this.currentDate = today.toISOString().split('T')[0];
      if (
        year > currentYear ||
        (year === currentYear && month > currentMonth) ||
        (year === currentYear && month === currentMonth && day > currentDay)
      ) {
        fromBS = NepaliFunctions.BS.GetCurrentDate(today);
      }
      const [yearTo, monthTo, dayTo] = toBS.split('-').map(Number); // Split and convert to numbers
      // check future dates for fromMiti
      if (
        yearTo > currentYear ||
        (yearTo === currentYear && monthTo > currentMonth) ||
        (yearTo === currentYear && monthTo === currentMonth && dayTo > currentDay)
      ) {
        const today = new Date();
        this.currentDate = today.toISOString().split('T')[0];
        
        toBS = NepaliFunctions.BS.GetCurrentDate(today);
      }
       /**End check toBs is set to future Date*/

      const fromDate  = NepaliFunctions.BS2AD(fromBS, "YYYY-MM-DD", "yyyy-MM-dd");
      const toDate  = NepaliFunctions.BS2AD(toBS, "YYYY-MM-DD", "yyyy-MM-dd");
      this.currentDate = fromDate;
      this.fiscalYearInADBeginning =  fromDate;
      this.fiscalYearInADEnd = toDate;
      this.fiscalYearInBSBeginning = fromBS;
      this.fiscalYearInBSEnd = toBS;
      if(this.firstTimeApiCallAutomatic) {
         /**Initially set defaulty obtain from fiscal year */
       this.inputForm.patchValue({
        fromMiti: this.fiscalYearInBSBeginning,
        toMiti: this.fiscalYearInBSEnd,
        fromDate: this.fiscalYearInADBeginning,
        toDate: this.fiscalYearInADEnd
      });
      if(this.loadInitial && !this.dynamicFieldExist) {
        this.setDateForApiCall();
      }
      }
      this.initializeFromMiti();
      this.initializeToMiti();
    }
    }


    fromdateChangeFn() {
      const _Date = this.inputForm.value.fromDate;
      const _Miti = NepaliFunctions.AD2BS(_Date, "YYYY-MM-DD", "YYYY-MM-DD");
      this.inputForm.patchValue({ fromMiti: _Miti });
    }
  
    fromMitiChangeFn() {
     const _miti = this.inputForm.value.fromMiti;
      const _date = NepaliFunctions.BS2AD(_miti, "YYYY-MM-DD", "yyyy-MM-dd");
      this.inputForm.patchValue({ fromDate: _date });
      const toMiti = document.getElementById("nepali-datepicker-to3") as HTMLInputElement;
      if (toMiti) {
        (toMiti as any).nepaliDatePicker({
          onChange: () => {
            const _miti = $("#nepali-datepicker-to3").val();
            const _date = NepaliFunctions.BS2AD(
              _miti,
              "YYYY-MM-DD",
              "yyyy-MM-dd"
            );
            this.inputForm.patchValue({toMiti:_miti, toDate: _date });

          },
          disableBefore: this.inputForm.value.fromMiti, 
          disableAfter: this.fiscalYearInBSEnd
        });
      } else {
        console.error('Element with id "nepali-datepicker" not found.');
      }
    }

    toMitiChangeFn() {
      const _miti = this.inputForm.value.toMiti;
      const _date = NepaliFunctions.BS2AD(_miti, "YYYY-MM-DD", "yyyy-MM-dd");
      this.inputForm.patchValue({ toDate: _date });
    }

    todateChangeFn() {
      const _Date = this.inputForm.value.toDate;
      const _Miti = NepaliFunctions.AD2BS(_Date, "YYYY-MM-DD", "YYYY-MM-DD");
      this.inputForm.patchValue({ toMiti: _Miti });
    }

    setDateForApiCall() {
      if (this.inputForm.invalid) {
        this._commonService.warning(
          "Error",
          "Please fill up the required fields!"
        );
        return;
      }
      this.emitData.next(this.inputForm.value);
    }

    isSelectField(field: DynamicField): boolean {
      return field.type === 'select';
    }
  
    getControl(name: string): FormControl {
      return this.inputForm.get(name) as FormControl;
    }

    resetToOriginal() {
       this.inputForm.patchValue({
        fromMiti: this.fiscalYearInBSBeginning,
        toMiti: this.fiscalYearInBSEnd,
        fromDate: this.fiscalYearInADBeginning,
        toDate: this.fiscalYearInADEnd
      });
    }


}
