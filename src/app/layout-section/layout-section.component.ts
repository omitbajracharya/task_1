import { Component, Input, OnInit } from '@angular/core';

interface ISectionLayoutProps {
  borderColor: string;
  headerBackground: string;
  contentBg: string;
  contentPadding: string;
  height: string;
  hasHeader: boolean;
  headerRight: boolean;
  mainTitle: string;
  rightContent: string;
}

@Component({
  selector: 'app-section-layout',
  templateUrl: './layout-section.component.html',
  styleUrls: ['./layout-section.component.scss'],
})
export class SectionLayoutComponent implements OnInit {
  private defaultProps: ISectionLayoutProps = {
    borderColor: '#f0f0f0',
    headerBackground: '#f7dbdb',
    contentBg: 'rgba(255,243,253,1)',
    contentPadding: '20px',
    height: 'auto',
    hasHeader: true,
    headerRight: true,
    mainTitle: 'Main Title',
    rightContent: 'Right Content',
  };

  @Input() public props: ISectionLayoutProps = { ...this.defaultProps };

  ngOnInit() {
    this.props = { ...this.defaultProps, ...this.props };
  }
}
