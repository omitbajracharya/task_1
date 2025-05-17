import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';
  tooltip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip && !!this.tooltipText) {
      this.tooltip = this.renderer.createElement('div') as HTMLElement;
      this.tooltip.innerText = this.tooltipText;
      this.renderer.addClass(this.tooltip, 'custom-tooltip');
      this.renderer.appendChild(document.body, this.tooltip);

      const rect = this.el.nativeElement.getBoundingClientRect();
      this.renderer.setStyle(this.tooltip, 'top', `${rect.top + window.scrollY}px`);
      this.renderer.setStyle(this.tooltip, 'left', `${rect.right + 2}px`);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }
}
