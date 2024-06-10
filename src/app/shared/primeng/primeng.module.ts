import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import {ProgressBarModule} from 'primeng/progressbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [],
  imports: [
    TooltipModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ImageModule,
    TableModule,
    ProgressBarModule,
    OverlayPanelModule,
    SidebarModule,
    ButtonModule,
    InputSwitchModule,
    ToastModule,
    CalendarModule,
    ConfirmDialogModule
  ],
  exports: [
    TooltipModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ImageModule,
    TableModule,
    ProgressBarModule,
    OverlayPanelModule,
    SidebarModule,
    ButtonModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule
  ],
  providers: [ConfirmationService]
})
export class PrimengModule { }
