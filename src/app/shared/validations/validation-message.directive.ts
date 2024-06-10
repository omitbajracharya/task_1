import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { combineLatestWith, fromEvent, startWith, takeWhile } from 'rxjs';
import { validationMessages } from './validation-messages';
@Directive({
  selector: '[formControlName]',
})
export class ValidationMessageDirective implements OnInit, OnDestroy {
  @Input() checkParent = false;
  private subscriptionState = true;
  errorLabel: HTMLLabelElement;
  constructor(
    private ngControl: NgControl,
    private renderer: Renderer2,
    private elemRef: ElementRef,
  ) {
    this.errorLabel = this.renderer.createElement('label');
  }
  ngOnInit() {
    const form = this.elemRef.nativeElement.parentNode.parentNode;
    this.ngControl.control?.statusChanges
      .pipe(
        startWith(this.ngControl.control?.status),
        combineLatestWith(fromEvent(form, 'submit')),
        takeWhile(() => this.subscriptionState),
      )
      .subscribe(() => {
        this.showHideErrors();
      });
  }

  ngOnDestroy(): void {
    this.subscriptionState = false;
  }

  private showHideErrors() {
    const parentControl = this.ngControl.control?.parent;
    const controlErrors =
      this.ngControl.errors ||
      (this.checkParent && parentControl ? parentControl.errors : null);
    if (controlErrors) {
      const err = Object.keys(controlErrors)[0];
      const errorMessage = validationMessages[err];
      this.errorLabel.innerText = errorMessage;
      this.renderer.addClass(this.errorLabel, 'text-danger');
      this.errorLabel.htmlFor = this.elemRef.nativeElement.id;
      this.renderer.insertBefore(
        this.elemRef.nativeElement.parentNode,
        this.errorLabel,
        this.elemRef.nativeElement.nextSibling,
      );
      return;
    }
    if (this.errorLabel.parentNode === this.elemRef.nativeElement.parentNode) {
      this.renderer.removeChild(
        this.elemRef.nativeElement.parentNode,
        this.errorLabel,
      );
    }
  }
}
