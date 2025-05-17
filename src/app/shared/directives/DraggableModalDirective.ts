import { Directive, HostListener, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appDraggableModal]",
})
export class DraggableModalDirective {
  private isDragging: boolean = false;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent): void {
    const modalHeader = this.el.nativeElement.querySelector(".modal-header");

    if (modalHeader && event.target === modalHeader) {
      this.isDragging = true;
      this.offsetX = event.clientX - this.el.nativeElement.offsetLeft;
      this.offsetY = event.clientY - this.el.nativeElement.offsetTop;
    }
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.renderer.setStyle(
        this.el.nativeElement,
        "left",
        event.clientX - this.offsetX + "px"
      );
      this.renderer.setStyle(
        this.el.nativeElement,
        "top",
        event.clientY - this.offsetY + "px"
      );
    }
  }

  @HostListener("document:mouseup")
  onMouseUp(): void {
    this.isDragging = false;
  }
}
