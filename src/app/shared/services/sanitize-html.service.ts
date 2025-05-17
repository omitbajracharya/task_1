import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class SanitizeHtmlService {
  constructor() { }

  // for formgroup, formcontrol
  sanitizeForm(form: FormGroup, excludeFields: string[] = []): any {
    const sanitizedData: any = {};

    for (const key in form.controls) {
      if (!form.controls.hasOwnProperty(key)) continue;

      const rawValue = form.get(key)?.value;

      // Skip excluded fields
      if (excludeFields.includes(key)) {
        sanitizedData[key] = rawValue;
        continue;
      }

      // Only sanitize string fields (e.g., text, HTML content)
      sanitizedData[key] =
        typeof rawValue === 'string'
          ? DOMPurify.sanitize(rawValue)
          : rawValue;
    }

    return sanitizedData;
  }

  // for html object
  sanitizeObject(obj: any, exclude: string[] = []): any {
    const cleanObj: any = {};
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
  
      const val = obj[key];
      cleanObj[key] =
        exclude.includes(key) || typeof val !== 'string'
          ? val // Leave out any non-string fields, or excluded fields
          : DOMPurify.sanitize(val); // Sanitize the string fields
    }
    return cleanObj;
  }
  
}
