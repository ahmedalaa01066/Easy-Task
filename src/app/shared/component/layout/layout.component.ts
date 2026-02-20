import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [SideMenuComponent, RouterModule]
})
export class LayoutComponent implements OnInit {
  meladyDate: string = '';
  hijriDate: string = '';

  ngOnInit() {
    this.updateDates();
  }

  /**
   * Updates both Melady and Hijri dates
   */
  updateDates() {
    this.meladyDate = this.generateMeladyDate();
    this.hijriDate = this.generateHijriDate();
  }

  /**
   * Generates current date in Melady (Gregorian) format
   * @returns formatted Gregorian date string
   */
  generateMeladyDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  }

  /**
   * Generates current date in Hijri (Islamic) format
   * @returns formatted Hijri date string
   */
  generateHijriDate(): string {
    const now = new Date();
    
    // Using Intl.DateTimeFormat for Hijri calendar
    try {
      const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const hijriDateParts = hijriFormatter.formatToParts(now);
      const year = hijriDateParts.find(part => part.type === 'year')?.value || '';
      const month = hijriDateParts.find(part => part.type === 'month')?.value || '';
      const day = hijriDateParts.find(part => part.type === 'day')?.value || '';
      
      return `${year} ,${day} ${month}`;
    } catch (error) {
      // Fallback to manual calculation if Intl.DateTimeFormat fails
      return this.calculateHijriDateManually(now);
    }
  }

  /**
   * Manual Hijri date calculation as fallback
   * @param gregorianDate - Gregorian date to convert
   * @returns formatted Hijri date string
   */
  private calculateHijriDateManually(gregorianDate: Date): string {
    // This is a simplified conversion - for production use a proper Hijri library
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];

    // Approximate conversion (this is not accurate for all dates)
    const gregorianYear = gregorianDate.getFullYear();
    const hijriYear = Math.floor((gregorianYear - 622) * 1.030684);
    const monthIndex = gregorianDate.getMonth();
    const day = gregorianDate.getDate();
    
    // Adjust for current approximation
    const adjustedHijriYear = hijriYear + 1;
    const hijriMonth = hijriMonths[monthIndex % 12];
    
    return `${adjustedHijriYear} ,${day} ${hijriMonth}`;
  }

  /**
   * Formats a specific date in Melady format
   * @param date - Date to format
   * @returns formatted Gregorian date string
   */
  formatMeladyDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Formats a specific date in Hijri format
   * @param date - Date to format
   * @returns formatted Hijri date string
   */
  formatHijriDate(date: Date): string {
    try {
      const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const hijriDateParts = hijriFormatter.formatToParts(date);
      const year = hijriDateParts.find(part => part.type === 'year')?.value || '';
      const month = hijriDateParts.find(part => part.type === 'month')?.value || '';
      const day = hijriDateParts.find(part => part.type === 'day')?.value || '';
      
      return `${year} ,${day} ${month}`;
    } catch (error) {
      return this.calculateHijriDateManually(date);
    }
  }
}
