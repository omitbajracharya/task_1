import { AbstractControl, ValidatorFn } from '@angular/forms';
export const nonZero = (
  control: AbstractControl,
): Record<string, boolean> | null => {
  if (control.value === 0) {
    return {
      zero: true,
    };
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const customValidator = (x: string, y: string): ValidatorFn => {
  return (controls: AbstractControl) => {
    if (controls) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const controlValue1 = controls.get('phone')!.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const controlValue2 = controls.get('dateOfBirth')!.value;

      // if (controlValue1 !== controlValue2) {
      //   //this is an error set for a specific control which you can use in a mat-error
      //   controls.get('ConfirmPassword')?.setErrors({ not_the_same: true });
      //   //this is the returned error for the form normally used to disable a submit button
      //   return { mismatchedPassword: true }
      // }
    }
    return null;
  };
};
