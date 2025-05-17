import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
// import {  ActivatedRoute, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
// import { MorbidityService } from '../user/morbidity/morbidity-service/morbidity.service';
// import { QueryParamsService } from '../services/query-params.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  payload: any;
  getPayload: any;
  updateUrl: any;
  cloneReq: any;
  cloneReqIgnoreGetEventAuth: any = null;
  responseObj:any;
  getResponseObj: any;
  startTime:any;
  endTime:any;
  splitUrl:any;
  moduleName:string = '';
  screenName:string = '';
  actionName:string = '';
  ipAddressData:any;
  statusCode:any;
  getStatusCode:any;
  description: string = '';
  getdescription: string = ''; 

  // constructor(private route: Router,private matDialog: MatDialog,
  //   private morbidityApi: MorbidityService,private queryParamsService: QueryParamsService) {
      
  // }
  constructor(private route: Router) {}
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userInfo: any = JSON.parse(localStorage.getItem('userInfo')!);
    // let startTime = Date.now();
    // this.getPayload = 
    if (userInfo) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${userInfo.access_token}`,
        // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarybVBBn4t0fH2KPiic'
      });
      this.cloneReq = request.clone({ headers });
    } else if(!userInfo && !userInfo?.access_token) {
      this.route.navigate(['/web/login']);
      this.cloneReq = request.clone();
    }
    let startdate = new Date().toUTCString();
    startdate = new Date(startdate).toISOString().split("T")[0] +  'T' + new Date().toTimeString().slice(0, 8);
    
    //condition use in downpart code
    const isNonGetAndNonEventLog = (this.cloneReq?.method !== 'GET' && !(this.cloneReq?.method === 'POST' && this.cloneReq?.url.split('/api').pop()=='/EventLog') && !this.cloneReq?.url.includes('/auth') && !this.cloneReq?.url.includes('/Auth/logout'));
    const isGetRequest = this.cloneReq?.method === 'GET';
    
    //store the non get or non eventlog request that may be post,put,delete in another clone variable so get request works properly since that get request overrides cloneRequest method of put,post,delete.
    if (isNonGetAndNonEventLog || this.cloneReqIgnoreGetEventAuth === null) {
      this.payload = request.body;
      this.startTime = startdate;
      this.cloneReqIgnoreGetEventAuth = JSON.parse(JSON.stringify(this.cloneReq));
    } else if (isGetRequest) {
      // this.getPayload = this.queryParamsService.getQueryParam(); 
      this.startTime = startdate;
    }

    return next.handle(this.cloneReq).pipe(map((event: any) => {
        if (event instanceof HttpResponse) {
          if(isNonGetAndNonEventLog){
            this.responseObj = event?.body  || "null";
            this.statusCode = event?.body?.statusCode || event?.status || null;
          }else if(isGetRequest){
            this.getResponseObj = event?.body  || event || null;
            this.getStatusCode = event?.status || null;
            if(this.getStatusCode == 200)
            {
              this.getdescription = 'Records fetched successfully.'
            }
            else {
              this.getdescription = 'Records fetched failed.';
            }
          }
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const isErrorConditionMet =isNonGetAndNonEventLog;
        //Just for userlog maintaining 
        if (isErrorConditionMet || this.cloneReq?.method === 'GET') {
          localStorage.setItem("userlog_description", 'Error occurred. Please try again.');
        }
        if(error.status === 401 || error.status === 403){
          //this.matDialog.closeAll();
          Swal.fire({
            icon: 'warning',
            title: 'Alert... !',
            text:  "Your Session Timeout.",
            focusConfirm: false
          })
          localStorage.clear();
          this.route.navigate(['/web/login']);
        }
        else if(error.status === 405 || error.status === 400  ||  error.status === 404) {
          console.log({error})
        }
        else if(error.status === 500) {
          localStorage.setItem('userlog_description', "Internal Server Error");
          // //
          Swal.fire({
            icon: 'warning',
            title: 'Alert... !',
            text:  "Internal Server Error",
            focusConfirm: false
          })
        } else if(error?.url?.includes("https://api-id-") && error?.url?.includes("georgeinstitute.org") && error.status === 0) {
          // //
          Swal.fire({
            icon: 'warning',
            title: 'Alert... !',
            text:  "We're currently experiencing some technical difficulties. This might be due to a temporary slowdown in our network or routine system updates. Please try again shortly. We apologize for any inconvenience",
            focusConfirm: false
          });
          this.route.navigate(['/web/login']);
        } 
        this.responseObj = error.error;
        return throwError(error);
      }),
      finalize(() => {
        //ipaddress
        const ipAddressLocal = localStorage.getItem('ipAddress')
        if(ipAddressLocal) {
          this.ipAddressData = JSON.parse(ipAddressLocal);
        }
        
        if(isNonGetAndNonEventLog)  //create log payload
        {
          this.splitUrl = this.cloneReqIgnoreGetEventAuth.url.split("/api/")?.[1].split('/'); 

          //ipaddress
          const ipAddressLocal = localStorage.getItem('ipAddress')
          if(ipAddressLocal) {
            this.ipAddressData = JSON.parse(ipAddressLocal);
          }
          console.log(this.description)
          //decription
          this.getDescription();
          if(this.description?.toLowerCase().includes('saved successfully') &&  this.responseObj?.statusCode == 'U0001' && this.description.indexOf('status changed to')===-1)
            {
              const descName =  this.toTitleCase(this.description?.toLowerCase().split(' saved')?.[0]);
              this.description = `${descName} updated successfully`;
            }    
          
          //actionname
          let actionName = this.getActionName();
          
          actionName = actionName.charAt(0).toUpperCase() + actionName.slice(1).toLocaleLowerCase();
          if(actionName === 'Update user list') {
            actionName = 'Update user';
          }
          else if(actionName === 'Add user list') {
            actionName = 'Add new user';
          }
          else if(actionName === 'Deactive user list') {
            actionName = 'Deactive user';
          }
          else if(actionName === 'Activate user list') {
            actionName = 'Activate user';
          }
          else if((this.description.includes('update') || this.description.includes('status changed to')) && this.cloneReqIgnoreGetEventAuth?.method === 'POST') {
            actionName = 'Update ' + actionName.split('Add ')[1]
          }
          else if (this.responseObj?.statusCode=='U0001' && actionName.includes('Add')) {
            actionName = 'Update'+ actionName.split('Add')[1];
          }
          
          let enddate = new Date().toUTCString();
          enddate = new Date(enddate).toISOString().split("T")[0] +  'T' + new Date().toTimeString().slice(0, 8);
          let date = new Date().toUTCString();
          let create_on = new Date(date).toISOString().split("T")[0] +  'T' + new Date().toTimeString().slice(0, 8);
          const localStorageHavingRequestJson = localStorage.getItem('requestJson');
          if(localStorageHavingRequestJson) {
            if(typeof localStorageHavingRequestJson !== 'string') {
              this.payload = JSON.parse(localStorageHavingRequestJson);
            }
            else {
              this.payload = localStorageHavingRequestJson;
            }
            localStorage.removeItem('requestJson');
          }
          else {
            if(this.cloneReqIgnoreGetEventAuth?.method === 'DELETE')
            {
              this.payload = this.splitUrl[this.splitUrl.length - 1];
            }
          }
         
          const localStatusValue = localStorage.getItem('userlog_statusValue') || undefined;
          const statusVal = localStatusValue || this.responseObj?.statusCode || this.responseObj?.status || this.responseObj?.StatusCode || this.statusCode || this.responseObj?.[0]?.status || (this.responseObj?.isSuccess?'200':'400');
          localStorage.removeItem('userlog_statusValue');
          let bodyRequest = {
            "event_Id": 0,
            "date": create_on,
            "time": new Date().toTimeString().slice(0, 8),
            "user": userInfo?.userName,
            "type": "WEB",
            "application": "SHV3 phase2",
            "module": this.moduleName,
            "screen": this.screenName,
            "action": actionName,
            "method": this.cloneReqIgnoreGetEventAuth?.method,
            "Request_execution_startdate": this.startTime,
            "Request_execution_enddate": enddate,
            "request": this.payload !== 'string'? JSON.stringify(this.payload): this.payload,
            "response": this.responseObj !== 'string'?JSON.stringify(this.responseObj):this.responseObj,
            "status": ['Active','Inactive'].includes(statusVal)?200:statusVal,
            "description":  this.description,
            "iP_Address": this.ipAddressData,
            "created_by": userInfo.dbUserId,
            "is_deleted": false,
            "createByNavigation": null
          }
          this.cloneReqIgnoreGetEventAuth = null;
        
          // localStorage.setItem("userlog",JSON.stringify(bodyRequest));
          // this.morbidityApi.UserLog(bodyRequest).subscribe((response: any) => {
          //   if (response) {
          //     if (response.statusCode === 'I0001') {
          //       console.log("Log created successfully")
          //     }
          //   }
          // })
          
        }
        else if(isGetRequest) { //create log payload // currently not used GET request
          const obj: { [key: string]: any } = {};
          this.cloneReq.params.map.forEach((value: any, key: string) => {
            obj[key] = value;
          });
          this.getPayload = JSON.stringify(obj);
          let enddate = new Date().toUTCString();
          enddate = new Date(enddate).toISOString().split("T")[0] +  'T' + new Date().toTimeString().slice(0, 8);
          let date = new Date().toUTCString();
          let create_on = new Date(date).toISOString().split("T")[0] +  'T' + new Date().toTimeString().slice(0, 8);
          this.splitUrl = this.cloneReq.url.split("/api/")?.[1].split('/');
          // modulename
          this.getModuleName();
          //screenname
          this.getScreenName();
         
          let bodyRequest = {
            "event_Id": 0,
            "date": create_on,
            "time": new Date().toTimeString().slice(0, 8),
            "user": userInfo?.userName,
            "type": "WEB",
            "application": "SHV3 phase2",
            "module": this.moduleName,
            "screen": this.screenName,
            "action": 'Fetching data',
            "method": "GET",
            "Request_execution_startdate": this.startTime,
            "Request_execution_enddate": enddate,
            "request": this.getPayload !== 'string'? JSON.stringify(this.getPayload): this.getPayload,
            "response": this.getResponseObj !== 'string'?JSON.stringify(this.getResponseObj):this.getResponseObj,
            "status": this.getStatusCode,
            "description":  this.getdescription,
            "iP_Address": this.ipAddressData,

            "created_by": userInfo.dbUserId,
            "is_deleted": false,
            "createByNavigation": null
          }
          // this.cloneReqIgnoreGetEventAuth = null;
          localStorage.removeItem('userlog_description');
          // localStorage.setItem("userlog",JSON.stringify(bodyRequest));
          // this.morbidityApi.UserLog(bodyRequest).subscribe((response: any) => {
          //   if (response) {
          //     if (response.statusCode === 'I0001') {
          //       console.log("Log created successfully")
          //     }
          //   }
          // })
        }
      })
    );
  }

  toTitleCase(str:string) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  
  getScreenName() {
    const titleCasePipe = new TitleCasePipe();
    this.screenName = this.splitUrl[0]?.toLowerCase();
    const screenNameInLocal = localStorage.getItem("screens");
    
    if(screenNameInLocal)
    {
      this.screenName = screenNameInLocal;
      // localStorage.removeItem("screens");
      return;
    }
    else {
      switch(true) {
        case this.screenName === 'maskvalidation':
          this.screenName = 'Validation Master'
          break;
        case this.screenName === 'locationLevel4':
          this.screenName = 'Block Location Master'
          break;  
        default:
          this.screenName = titleCasePipe.transform(this.screenName.replace(/-/g, ' '));   
      }
    }

  }

  getModuleName() {
    
    const titleCasePipe = new TitleCasePipe();
    this.moduleName = this.splitUrl[0]?.toLowerCase();
    const moduleNameInLocal = localStorage.getItem("modules");
    
    if(moduleNameInLocal)
    {
      this.moduleName = moduleNameInLocal;
      // localStorage.removeItem("modules");
      return;
    }
    else {
      switch(true) {
        case this.moduleName === 'maskvalidation':
          this.moduleName = 'Validation Master'
          break;
        case this.moduleName?.toLowerCase() === 'locationlevel 4':
          this.moduleName = 'Block Location Master'
          break;  
        default:
          this.moduleName = titleCasePipe.transform(this.moduleName.replace(/-/g, ' '));   
      }
    }

  } 
  getActionName() {
    // const url = new URL(this.cloneReqIgnoreGetEventAuth?.url);
    // const path = url.pathname; 
    const actionFromLocal = localStorage.getItem('userlog_action');
    if(actionFromLocal)
      {
        const actionVal = actionFromLocal;
        setTimeout(()=> {
          localStorage.removeItem('userlog_action');
        },0)
        return actionVal;
      }
    let actionVal = this.screenName?.toLowerCase();
    switch(true) {
      case this.splitUrl.includes('ChangePassword'):
        return  'Change Password';
      default:
          return (this.cloneReqIgnoreGetEventAuth?.method === "POST" ? (this.cloneReqIgnoreGetEventAuth?.url.includes('/status/activate')?'Activate ': 'add '):this.cloneReqIgnoreGetEventAuth?.method ==='PUT' ? 'update ' : this.cloneReqIgnoreGetEventAuth?.method === 'DELETE'?(this.cloneReqIgnoreGetEventAuth?.url.includes('/users')?'Deactive ':'delete '): 'get ') + actionVal; 
    }
  }

  getDescription() {
    const descriptionFromLocal = localStorage.getItem('userlog_description');
    if(descriptionFromLocal)
    {
      this.description = descriptionFromLocal;
      setTimeout(()=> {
        localStorage.removeItem('userlog_description');
      },0)
      return;
    }
    else if(typeof this.responseObj === 'boolean' && this.responseObj === true && this.cloneReqIgnoreGetEventAuth?.method === "DELETE") {
      this.description = 'Record deleted successfully'
    }
    else if(this.responseObj.description?.toLowerCase()=='record saved successfully' || this.responseObj.description?.toLowerCase()=='record updated successfully') {
      const desc = this.responseObj.description?.toLowerCase();
      this.description =  desc.charAt(0).toUpperCase() + desc.slice(1);
    }
    else {
      this.description = this.responseObj.statusValue || this.responseObj?.description || this.responseObj?.message || this.responseObj?.error?.title  || this.responseObj?.error?.message || this.responseObj?.error?.Message || this.responseObj?.[0]?.message || this.responseObj?.responseMsg || this.responseObj?.statusDesc || "null";
    }
    if(this.description === 'Record saved successfully' && (this.cloneReqIgnoreGetEventAuth?.method === "PUT" || this.responseObj?.statusCode == 'U0001') && this.description.indexOf('status changed to')===-1)
      {
        this.description = 'Record updated successfully';
      }    
    return;
  }
}
