import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
interface MenuItem {
  label: string;
  icon?: string;
  link: string;
  queryParams?: any;
}

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('appTooltip') menuItems: MenuItem[] = [];
  @Input() isSubmenuItem: boolean = false;

  private tooltipElement: HTMLElement | null = null;
  private arrowElement: HTMLElement | null = null;
  private tooltipText: string = '';
  private removeTimeout: ReturnType<typeof setTimeout> | null = null;
  private isHoveringHost = false;
  private isHoveringTooltip = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
  ) {}

  ngOnInit() {
    this.tooltipText = this.el.nativeElement.getAttribute('title') || '';
    this.renderer.removeAttribute(this.el.nativeElement, 'title');
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
      this.removeTimeout = null;
    }

    if (this.isSidebarCollapsed()) {
      if (this.isSubmenuItem && this.tooltipText) {
        this.createSimpleTooltip();
      } else if (!this.isSubmenuItem && this.menuItems?.length) {
        this.createMenuTooltip();
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.scheduleTooltipRemoval();
  }

  private createSimpleTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    if (!this.tooltipElement) return;

    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.tooltipElement.textContent = this.tooltipText;

    // Apply basic styling
    const styles = {
      position: 'fixed',
      'background-color': 'rgba(0, 0, 0, 0.75)',
      color: 'white',
      padding: '8px 12px',
      'border-radius': '4px',
      'z-index': '1000',
      'pointer-events': 'none',
      opacity: '0',
      transition: 'opacity 0.2s',
      'max-width': '300px',
      'white-space': 'nowrap',
    };

    Object.entries(styles).forEach(([prop, value]) => {
      this.renderer.setStyle(this.tooltipElement, prop, value);
    });

    this.renderer.appendChild(document.body, this.tooltipElement);
    this.positionSimpleTooltip();
  }

  private positionSimpleTooltip() {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    let left = hostRect.right + 5;
    let top = hostRect.top + hostRect.height / 2;

    setTimeout(() => {
      if (!this.tooltipElement) return;

      const tooltipRect = this.tooltipElement.getBoundingClientRect();

      // Adjust for right edge overflow
      if (left + tooltipRect.width > window.innerWidth) {
        left = hostRect.left - tooltipRect.width - 5;
      }

      // Adjust for bottom edge overflow
      if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 5;
      }

      // Adjust for top edge overflow
      if (top < 0) {
        top = 5;
      }

      this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
      this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
      this.renderer.setStyle(
        this.tooltipElement,
        'transform',
        'translateY(-50%)',
      );
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    });
  }

  private createMenuTooltip() {
    this.removeTooltip();

    this.tooltipElement = this.renderer.createElement('div');
    if (!this.tooltipElement) return;

    this.renderer.addClass(this.tooltipElement, 'tooltip-menu');

    // Apply menu tooltip styling
    const styles = {
      position: 'fixed',
      background: '#fff',
      border: '1px solid #ddd',
      'border-radius': '6px',
      'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
      'z-index': '1000',
      opacity: '0',
      transition: 'all 0.3s ease',
      width: 'fit-content',
      'overflow-y': 'auto',
      display: 'flex',
      gap: '20px',
      'flex-direction': 'column',
      padding: '8px',
    };

    Object.entries(styles).forEach(([prop, value]) => {
      this.renderer.setStyle(this.tooltipElement, prop, value);
    });

    this.setHostHoverState(true);
    this.createArrow();
    this.setupHoverEvents();
    this.createMenuContent();
    this.positionMenuTooltip();
  }

  private createMenuContent() {
    if (!this.tooltipElement) return;

    const shouldUseTwoColumns = this.menuItems.length > 5;
    const columns = shouldUseTwoColumns ? 2 : 1;
    const chunkedItems = this.chunkArray(
      this.menuItems,
      Math.ceil(this.menuItems.length / columns),
    );

    const row = this.renderer.createElement('div');
    this.renderer.setStyle(row, 'display', 'flex');
    this.renderer.setStyle(row, 'gap', '20px');

    chunkedItems.forEach((group) => {
      const column = this.renderer.createElement('ul');
      this.renderer.addClass(column, 'nav');
      this.renderer.addClass(column, 'flex-column');
      this.renderer.setStyle(column, 'width', 'fit-content');
      this.renderer.setStyle(column, 'margin', '0');
      this.renderer.setStyle(column, 'padding', '0');

      group.forEach((item) => {
        const li = this.renderer.createElement('li');
        this.renderer.addClass(li, 'nav-item');
        this.renderer.setStyle(li, 'margin', '4px 0');
        this.renderer.setStyle(li, 'list-style', 'none');

        const a = this.renderer.createElement('a');
        this.renderer.addClass(a, 'nav-link');

        // Menu item styling
        const linkStyles = {
          padding: '10px 15px',
          'white-space': 'nowrap',
          color: '#333',
          'text-decoration': 'none',
          display: 'flex',
          'align-items': 'center',
          'border-radius': '4px',
          transition: 'all 0.3s ease',
          'justify-content': 'flex-start',
          gap: '10px',
        };

        Object.entries(linkStyles).forEach(([prop, value]) => {
          this.renderer.setStyle(a, prop, value);
        });

        // Add icon if exists
        if (item.icon) {
          const icon = this.renderer.createElement('i');
          item.icon.split(' ').forEach((className: string) => {
            if (className.trim()) {
              this.renderer.addClass(icon, className);
            }
          });
          this.renderer.setStyle(icon, 'font-size', '14px');
          this.renderer.appendChild(a, icon);
        }

        // Add label text
        const label = this.renderer.createText(item.label);
        this.renderer.appendChild(a, label);

        // Hover effects
        this.renderer.listen(a, 'mouseenter', () => {
          this.renderer.setStyle(a, 'background-color', '#f87f3f');
          this.renderer.setStyle(a, 'color', '#fff');
        });

        this.renderer.listen(a, 'mouseleave', () => {
          this.renderer.setStyle(a, 'background-color', 'transparent');
          this.renderer.setStyle(a, 'color', '#333');
        });

        // Click handler
        this.renderer.listen(a, 'click', (event: any) => {
          event.preventDefault();
          this.router.navigate([item.link], { queryParams: item.queryParams });
          this.removeTooltip();
        });

        this.renderer.appendChild(li, a);
        this.renderer.appendChild(column, li);
      });

      this.renderer.appendChild(row, column);
    });

    this.renderer.appendChild(this.tooltipElement, row);
    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  private positionMenuTooltip() {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    let left = hostRect.right + 10;
    let top = hostRect.top;

    setTimeout(() => {
      if (!this.tooltipElement) return;

      const tooltipRect = this.tooltipElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const maxTooltipHeight = Math.min(viewportHeight * 0.8, 500);

      // Right overflow check
      if (left + tooltipRect.width > window.innerWidth) {
        left = hostRect.left - tooltipRect.width - 10;
        left = Math.max(10, left);
      }

      // Height adjustment
      if (tooltipRect.height > maxTooltipHeight) {
        this.renderer.setStyle(
          this.tooltipElement,
          'max-height',
          `${maxTooltipHeight}px`,
        );
      }

      // Bottom overflow check
      if (top + tooltipRect.height > viewportHeight) {
        top = viewportHeight - tooltipRect.height - 10;
        top = Math.max(10, top);
      }

      // Top overflow check
      if (top < 0) {
        top = 10;
      }

      this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
      this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    });
  }

  private createArrow() {
    // Remove existing arrow if present
    if (this.arrowElement) {
      this.renderer.removeChild(this.el.nativeElement, this.arrowElement);
      this.arrowElement = null;
    }

    this.arrowElement = this.renderer.createElement('div');
    if (!this.arrowElement) return;

    this.renderer.addClass(this.arrowElement, 'tooltip-arrow');

    // Arrow styling
    const arrowStyles = {
      position: 'absolute',
      width: '0',
      height: '0',
      'border-top': '6px solid transparent',
      'border-bottom': '6px solid transparent',
      'border-right': '6px solid white',
      top: '50%',
      right: '0',
      transform: 'translateY(-50%)',
    };

    Object.entries(arrowStyles).forEach(([prop, value]) => {
      this.renderer.setStyle(this.arrowElement, prop, value);
    });

    // Ensure host has relative positioning
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    // Append arrow to host element
    this.renderer.appendChild(this.el.nativeElement, this.arrowElement);
  }

  private setupHoverEvents() {
    if (!this.tooltipElement) return;

    // Tooltip hover events
    this.renderer.listen(this.tooltipElement, 'mouseenter', () => {
      this.isHoveringTooltip = true;
      this.setHostHoverState(true);
      if (this.removeTimeout) {
        clearTimeout(this.removeTimeout);
        this.removeTimeout = null;
      }
    });

    this.renderer.listen(this.tooltipElement, 'mouseleave', () => {
      this.isHoveringTooltip = false;
      if (!this.isHoveringHost) {
        this.setHostHoverState(false);
      }
      this.scheduleTooltipRemoval();
    });

    // Host element hover events
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => {
      this.isHoveringHost = true;
      this.setHostHoverState(true);
      if (this.removeTimeout) {
        clearTimeout(this.removeTimeout);
        this.removeTimeout = null;
      }
    });

    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
      this.isHoveringHost = false;
      if (!this.isHoveringTooltip) {
        this.setHostHoverState(false);
      }
      this.scheduleTooltipRemoval();
    });
  }

  private setHostHoverState(isHovered: boolean) {
    const bgColor = isHovered ? '#f87f3f' : '';
    const textColor = isHovered ? '#fff' : '';

    this.renderer.setStyle(this.el.nativeElement, 'background', bgColor);
    this.renderer.setStyle(this.el.nativeElement, 'color', textColor);

    // Handle icon color if exists
    const icon = this.el.nativeElement.querySelector('i');
    if (icon) {
      this.renderer.setStyle(icon, 'color', textColor);
    }
  }

  private removeTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }

    if (!this.isHoveringHost && !this.isHoveringTooltip && this.arrowElement) {
      this.renderer.removeChild(this.el.nativeElement, this.arrowElement);
      this.arrowElement = null;
      this.renderer.removeStyle(this.el.nativeElement, 'position');
    }
  }

  private scheduleTooltipRemoval() {
    this.removeTimeout = setTimeout(() => {
      if (!this.isHoveringHost && !this.isHoveringTooltip) {
        this.removeTooltip();
      }
      this.removeTimeout = null;
    }, 200);
  }

  private isSidebarCollapsed(): boolean {
    const sidebar = document.querySelector('nav.sidebar');
    return sidebar?.classList.contains('collapsed') ?? false;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  ngOnDestroy() {
    this.removeTooltip();
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
      this.removeTimeout = null;
    }
  }
}
