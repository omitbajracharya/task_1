import { NgModule, Optional, SkipSelf } from '@angular/core';
import { A404PageComponent } from './components/a404-page/a404-page.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [A404PageComponent, NotificationComponent],
  imports: [SharedModule],
  exports: [NotificationComponent],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only',
      );
    }
  }
}
