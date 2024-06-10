import { animate, style, trigger, transition } from '@angular/animations';

export const fadeAnimation = [
  trigger('fadeInOut', [
    transition('void => *', [
      // :enter is alias to 'void => *'
      style({ opacity: 0 }),
      animate(500, style({ opacity: 1 })),
    ]),
    transition('* => void', [
      // :leave is alias to '* => void'
      animate(500, style({ opacity: 0 })),
    ]),
  ]),
];

export const slideAnimation = [
  trigger('slideInOut', [
    transition('void => *', [
      // :enter is alias to 'void => *'
      style({ right: '-550px' }),
      animate(
        '700ms cubic-bezier(0.680, -0.550, 0.265, 1.550)',
        style({ right: '0' }),
      ),
    ]),
    transition('* => void', [
      // :leave is alias to '* => void'
      animate(
        '700ms cubic-bezier(0.680, -0.550, 0.265, 1.550)',
        style({ right: '-550px' }),
      ),
    ]),
  ]),
];
