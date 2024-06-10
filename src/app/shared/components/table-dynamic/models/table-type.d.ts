/* eslint-disable @typescript-eslint/consistent-type-definitions */
type TTableComponent = {
  title: string;
  headerInputType?: string;
  headerBindValue?: string;
  bindValue?: string;
  emptyValue?: string;
  inputType?: string;
  svgImg?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickEvent?: (...emittedData: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseValue?: (data: any) => any;
  // eslint-disable-next-line @typescript-eslint/array-type
  buttonType?: Array<{
    name?: string;
    bindValue?: string;
    actionName?: string;
    icon?: string;
    customClasses?: string;
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-explicit-any
    customStyles?: { [key: string]: any };
    imgSrc?: string;
    contentProjectName?: string;
    tooltipMsg?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clickEvent: (...emittedData: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseValue?: (data: any) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkForDisabledBtn?: (data: any) => any;
  }>;
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-explicit-any
  customStyles?: { [key: string]: any };
  customClasses?: string | string[];
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  headerStyle?: { [key: string]: string };
  isImage?: boolean;
  isIcon?: boolean;
  isToFixedFloating?: boolean;
};
