import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModuleTabList, TModule } from 'src/assets/constants/module-tab-list';

@Component({
  selector: 'tab-generic',
  templateUrl: './tab-generic.component.html',
  styleUrls: ['./tab-generic.component.scss']
})
export class TabGenericComponent implements OnInit, OnChanges {
  private jwtHelper = new JwtHelperService();

  @Input() moduleName: TModule = 'Dashboard';  //moduleName will come from sidebar
  @Output() sendScreenName: EventEmitter<{ screenName: string }> = new EventEmitter<{ screenName: string }>();
  @Output() IsTabData: EventEmitter<boolean> = new EventEmitter<boolean>();
  tabList: any[] = [];
  constructor(private route: Router) { }
  selectedIndex: any;
  CurrentModuleName: any;

  ngOnInit(): void {
    let actieveTab = JSON.parse(localStorage.getItem('openTabNumber')!);
    let UserData = JSON.parse(localStorage.getItem('userInfo')!);
    this.CurrentModuleName = (localStorage.getItem('currentModuleName'));
    let AllUserRoleTabMenuOfSubMenu: any = UserData?.AllUserRoleTabMenuOfSubMenu || [];

    if (actieveTab) {
      this.selectedIndex = actieveTab;
    } else {
      this.selectedIndex = 0;
    }
    const userInfo: any = JSON.parse(localStorage.getItem('userInfo')!);
    if (userInfo?.access_token && !this.jwtHelper.isTokenExpired(userInfo?.access_token)) {
      const tokenRoles = this.jwtHelper.decodeToken(userInfo.access_token).role;
      this.tabList = AllUserRoleTabMenuOfSubMenu[this.CurrentModuleName] || []; //if allowed role is not mentioned then that tab is allowed for all users i.e. defaultly superadmin.
      this.IsTabData.emit(this.tabList.length > 0);
      const event = {
        index: this.selectedIndex
      };
      this.tabClick(event);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moduleName']) {
      this.ngOnInit();
    }
  }

  // on tab click
  public tabClick(event: any): void {
    localStorage.setItem('openTabNumber', JSON.stringify(event?.index));
    const openTab = this.tabList?.[event?.index];
    if (openTab?.menu) {
      this.route.navigate([openTab?.menuUrl]);
      localStorage.setItem('screens', openTab?.menu);
      localStorage.setItem('modules', this.moduleName);
      this.sendScreenName.emit({
        screenName: openTab?.menu
      });
    }
  }
}