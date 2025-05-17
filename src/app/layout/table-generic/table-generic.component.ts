import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-generic',
  templateUrl: './table-generic.component.html',
  styleUrl: './table-generic.component.scss'
})
export class TableGenericComponent {
  @Input() tableTitle?: string = '';
  @Input() printTitle?: string = '';
  @Input() columns: TTableComponent[] = [];
  @Input() data: any[] = [];
  @Input() showSerialNumber: boolean = true;
  @Input() serialNumberText: string = 'S.N';
  @Input() emptyMessage: string = 'No data available for the selected criteria.';
  @Input() rowActions: { icon: string, label: string, action: string }[] = [];
  @Input() individualId: string = '';
  @Input() filterFormData: any = {};
  @Input() routeUrl: string = '';
  @Input() showPrint: boolean = true;
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();


  isprint:boolean = false;

  currentSort: {column: string, direction: 'asc' | 'desc'} | null = null;

  get visibleColumns(): TTableComponent[] {
    return this.columns.filter(col => !col.hidden);
  }

  @ViewChild('statusTemplate', { static: true }) statusTemplate?: TemplateRef<any>;

  constructor( private router: Router,) {}
  // Safe way to handle template references
  getSafeTemplate(template: TemplateRef<any> | undefined | null): TemplateRef<any> | null {
    return template || null;
  }

  onSort(column: TTableComponent) {
    if (!column.sortable) return;
    
    if (this.currentSort?.column === column.bindValue) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = {
        column: column.bindValue,
        direction: 'asc'
      };
    }
    
    this.sortChange.emit(this.currentSort);
  }

  onActionClick(action: string, item: any) {
    this.actionClick.emit({action, item});
  }

   print() {
    let DateFrom = this.filterFormData?.fromMiti;
    let DateTo = this.filterFormData?.toMiti;
    let routeUrl = this.routeUrl;
    localStorage.setItem("currentRoutePreview",routeUrl);

    const newTabUrl = this.router
      .createUrlTree(["voucher/print-preview"], {
        queryParams: {
          DateFrom,
          DateTo
        }
        ,
      })
      .toString();
    window.open(newTabUrl, "_blank");
  }

 exportDOMTable() {
  const container = document.getElementById('personalTrialBalanceTable');
  if (!container) return;

  const tables = container.querySelectorAll('app-table-generic table');
  let html = '';

  tables.forEach((table, index) => {
    const tableClone = table.cloneNode(true) as HTMLTableElement;
    const tableTitle = table.closest('app-table-generic')?.getAttribute('tableTitle') || `Table ${index + 1}`;
    const finalTitle = this.tableTitle || this.printTitle || tableTitle;

    const colCount = tableClone.querySelector('thead tr:last-child')?.children.length || 1;

    // Insert title row at the top
    const titleRow = document.createElement('tr');
    const titleCell = document.createElement('th');
    titleCell.setAttribute('colspan', colCount.toString());
    titleCell.innerHTML = `<div style="text-align:center; font-weight:bold;">${finalTitle}</div>`;
    titleRow.appendChild(titleCell);
    tableClone.tHead?.insertBefore(titleRow, tableClone.tHead.firstChild);

    html += `<table border="1">${tableClone.innerHTML}</table><br/>`;
  });

  const fullHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]><xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${this.tableTitle || this.printTitle || 'Sheet'}</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml><![endif]-->
    </head>
    <body>${html}</body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${this.tableTitle || this.printTitle || 'Report'}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  printIndividual() {
    const printContent = document.getElementById(this.individualId)?.innerHTML || "";
    const printWindow = window.open("", "_blank", "height=1200,width=1600");

    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Print</title>
          <style>
            /* Basic DataTable styles for printing */
            .dataTable {
              width: 100%;
              max-width: 100%;
              margin-bottom: 1rem;
              background-color: transparent;
              border-collapse: collapse;
            }
            
            .dataTable thead th {
              vertical-align: bottom;
              border-bottom: 2px solid #dee2e6;
              text-align: left;
            }
            
            .dataTable td, .dataTable th {
              padding: 0.75rem;
              vertical-align: top;
              border-top: 1px solid #dee2e6;
            }
            
            .dataTable tbody tr:nth-of-type(odd) {
              background-color: rgba(0, 0, 0, 0.05);
            }
            
            /* Your existing print styles */
            @media print {
              .hidden,.btn-print {
                display: none;  
              }
              @page {
                margin: 20mm;
                size: portrait;
              }
              
              body {
                margin: 1cm;
                font-family: Arial, sans-serif;
                font-size: 12pt;
                color: #000;
              }
              
              .d-flex {
                display: flex !important;
              }
              
              .flex-column {
                flex-direction: column !important;
              }
              
              .table-image {
                max-width: 100px;
                max-height: 60px;
                border-radius: 4px;
              }
              
              .sortable {
                cursor: pointer;
                user-select: none;
              }
              
              .sortable:hover {
                background-color: #f5f5f5;
              }
              
              .sort-icon {
                margin-left: 5px;
              }
              
              .action-cell {
                white-space: nowrap;
                width: 1%;
              }
              
              .action-cell .btn-group {
                display: flex;
                gap: 5px;
              }
              
              .badge {
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 12px;
              }
              
              .badge-success {
                background-color: #28a745;
                color: white;
              }
              
              .badge-danger {
                background-color: #dc3545;
                color: white;
              }
              
              .centerText {
                text-align: center;
              }
              
              .rightText {
                text-align: end;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
              }
              
              table, td, th {
                border: 1px solid #ddd;
              }
              
              th {
                font-weight: bold;
                background: #f8f9fa;
              }
              
              td {
                padding: 6px 10px;
              }
              
              /* Hide buttons in print */
              .dt-buttons, .action-cell {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <h5 style="text-align: center; margin-bottom: 20px;">${this.tableTitle || ''}</h5>
          ${printContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 200);
      };
    }
  }
}

type InputType = 'text' | 'number' | 'date' | 'image' | 'boolean' | 'currency' | 'search' | 'custom';

interface TTableComponent {
  title: string;
  bindValue: string;
  inputType?: InputType;
  customStyles?: { [key: string]: string };
  headerStyles?: { [key: string]: string };
  cellTemplate?: TemplateRef<any> | null;  // Add null as possible type
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  hidden?: boolean;
  isAmount?: boolean;
}