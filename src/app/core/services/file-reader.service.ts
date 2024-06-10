import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  constructor() {}

  static dataUrlToFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  static downloadFile(downloadFile: any, filename: string): Observable<void> {
    return from(
      fetch(downloadFile.url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }),
    );
  }

  static readFile(
    file: File,
    type: string,
  ): Observable<string | ArrayBuffer | null> {
    return new Observable<string | ArrayBuffer | null>((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result);
        observer.complete();
      };
      reader.onerror = (error) => observer.error(error);
      if (type === 'DataURL') {
        reader.readAsDataURL(file);
      } else if (type === 'ArrayBuffer') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }
}
