import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { map } from 'rxjs/operators';
import {
  allCourses,
  coursesStatistics,
  levelsStatistics,
  searchEmployeeAttendence,
} from '../../../models/interfaces/dashboard';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

Chart.register(...registerables);

@Component({
  selector: 'app-hr-dashboard-content',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    CalendarModule,

  ],
})
export class HrDashboardContentComponent implements AfterViewInit {
  @ViewChild('attendanceChart') attendanceChartRef!: ElementRef;
  @ViewChild('courseChart') courseChartRef!: ElementRef;
  constructor(private dashboardService: DashboardService) { }
  pageNumber: number = 1;
  totalRecords: number = 0;
  rows: number = 4;
  courseChartInstance: any;
  levelsStatisticsData: levelsStatistics[] = [];
  recommendedCourses: allCourses[] = [];
  fromDate: Date | null = null;
  toDate: Date | null = null;
  attendanceData = [
    { title: 'Attendance', value: 0 },
    { title: 'Annual', value: 0 },
    { title: 'Work from home', value: 0 },
  ];
  courseStatistics: coursesStatistics = {
    courseCount: 0,
    assignedCourseCount: 0,
    unassignedCourseCount: 0,
  };

  ngOnInit() {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    this.fromDate = lastWeek;
    this.toDate = today;
    this.loadAttendanceData();
    this.loadRecommendedCourses();
    this.loadCourseStatistics();
    this.loadLevelStatistics();
    this.loadChartData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  filterByDate() {
    if (!this.fromDate || !this.toDate) {
      alert('Please select both From and To dates');
      return;
    }

    const from = this.fromDate.toISOString().split('T')[0];
    const to = this.toDate.toISOString().split('T')[0];

    const searchViewModel = {
      FromDate: from,
      ToDate: to
    };

    // لو فيه شارت مرسوم قبليها، نمسحه قبل نرسم الجديد
    const existingChart = Chart.getChart('attendanceChart');
    if (existingChart) {
      existingChart.destroy();
    }

    this.dashboardService.getEmployeeAttendanceGraph(searchViewModel)
      .pipe(
        map((res: any) => {
          if (res?.isSuccess && res.data?.length) {
            const labels = res.data.map((item: any) =>
              new Date(item.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit'
              })
            );

            const attendanceData = res.data.map((x: any) => x.attendanceCount || 0);
            const annualLeave = res.data.map((x: any) =>
              x.vacations?.find((v: any) =>
                v.vacationType?.toLowerCase() === 'annual leave'
              )?.count || 0
            );

            const wfh = res.data.map((x: any) =>
              x.vacations?.find((v: any) =>
                v.vacationType?.toLowerCase() === 'work from home'
              )?.count || 0
            );


            return { labels, attendanceData, annualLeave, wfh };
          }
          return null;
        })
      )
      .subscribe({
        next: (mapped) => {
          if (mapped) {
            this.renderChart(mapped);
          } else {
            console.warn('No data found for selected date range.');
          }
        },
        error: (err) => {
          console.error('Error fetching filtered attendance data:', err);
        }
      });
  }

  loadAttendanceData() {
    this.dashboardService.getAttendance().subscribe({
      next: (res: any) => {
        if (res?.isSuccess && res.data) {
          this.attendanceData = [
            { title: 'Attendance', value: res.data.attendance ?? 0 },
            { title: 'Annual', value: res.data.annual ?? 0 },
            { title: 'Work from home', value: res.data.workFromHome ?? 0 },
          ];
        }
      },
      error: (err) => {
        console.error('Error fetching attendance data:', err);
      },
    });
  }

  loadRecommendedCourses() {
    const searchViewModel = { Name: '' };
    const orderBy = 'name';
    const isAscending = true;
    const pageIndex = 1;
    const pageSize = 4;

    this.dashboardService
      .getRecommendedCourses(
        searchViewModel,
        orderBy,
        isAscending,
        pageIndex,
        pageSize
      )
      .subscribe({
        next: (res: any) => {
          if (res?.isSuccess && res.data?.items?.length) {
            this.recommendedCourses = res.data.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              numOfCandidates: item.numOfCandidates,
            }));
          }
        },
        error: (err) => {
          console.error('Error fetching recommended courses:', err);
        },
      });
  }

  loadCourseStatistics() {
    this.dashboardService.getcourseStatistics().subscribe({
      next: (res: any) => {
        if (res?.isSuccess && res.data) {
          this.courseStatistics = {
            courseCount: res.data.courseCount ?? 0,
            assignedCourseCount: res.data.assignedCourseCount ?? 0,
            unassignedCourseCount: res.data.unassignedCourseCount ?? 0,
          };
          // بعد تحميل البيانات نرسم الشارت
          this.createCourseChart();
        }
      },
      error: (err) => {
        console.error('Error fetching course statistics:', err);
      },
    });
  }

  ngAfterViewInit() {
    // this.renderChart();
  }

  renderChart(mapped: any) {
    const ctx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    const ctx2d = ctx.getContext('2d')!;

    // 🎨 Gradients
    const gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(3, 152, 85, 0.7)');
    gradient.addColorStop(1, 'rgba(3, 152, 85, 0)');

    const gradient2 = ctx2d.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(220, 104, 3, 0.4)');
    gradient2.addColorStop(1, 'rgba(220, 104, 3, 0)');

    const gradient4 = ctx2d.createLinearGradient(0, 0, 0, 400);
    gradient4.addColorStop(0, 'rgba(85, 196, 199, 0.4)');
    gradient4.addColorStop(1, 'rgba(85, 169, 199, 0)');

    // 📊 بيانات الرسم
    const data = {
      labels: mapped.labels,
      datasets: [
        {
          label: 'Attendance',
          data: mapped.attendanceData,
          borderColor: '#00AEEF',
          backgroundColor: gradient4,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Work from home',
          data: mapped.wfh,
          borderColor: '#8E59FF',
          backgroundColor: 'rgba(127, 86, 217, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Annual Leave',
          data: mapped.annualLeave,
          borderColor: '#DC6803',
          backgroundColor: gradient2,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    };

    // ⚙️ إعداد الرسم البياني
    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true }
          }
        },
        scales: {
          y: {
            title: { display: true, text: 'Attendance' },
            beginAtZero: true
          },
          x: {
            title: { display: true, text: 'Days' }
          }
        }
      }
    };

    // 🧾 رسم الشارت
    new Chart(ctx, config);
  }

  loadChartData() {
    const today = new Date();
    const toDate = today.toISOString().split('T')[0];
    const fromDateObj = new Date(today);
    fromDateObj.setDate(today.getDate() - 7);
    const fromDate = fromDateObj.toISOString().split('T')[0];

    const searchViewModel = {
      FromDate: fromDate,
      ToDate: toDate
    };

    this.dashboardService.getEmployeeAttendanceGraph(searchViewModel)
      .pipe(
        map((res: any) => {
          if (res?.isSuccess && res.data?.length) {
            const labels = res.data.map((item: any) =>
              new Date(item.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit'
              })
            );

            const attendanceData = res.data.map((x: any) => x.attendanceCount || 0);

            const annualLeave = res.data.map((x: any) =>
              x.vacations?.find((v: any) =>
                v.vacationType?.toLowerCase() === 'annual leave'
              )?.count || 0
            );

            const wfh = res.data.map((x: any) =>
              x.vacations?.find((v: any) =>
                v.vacationType?.toLowerCase() === 'work from home'
              )?.count || 0
            );


            return { labels, attendanceData, annualLeave, wfh };
          }
          return null;
        })
      )
      .subscribe(mapped => {
        if (mapped) {
          // هنا فقط بعد ما الداتا توصل نرسم الشارت
          this.renderChart(mapped);
        }
      });
  }



  createCourseChart() {
    const ctx = this.courseChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    if (this.courseChartInstance) {
      this.courseChartInstance.destroy();
    }

    this.courseChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Assigned', 'Unassigned'],
        datasets: [
          {
            data: [
              this.courseStatistics.assignedCourseCount,
              this.courseStatistics.unassignedCourseCount,
            ],
            backgroundColor: ['#61B1C7', '#444CE7'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  loadLevelStatistics() {
    this.dashboardService.getLevelStatistics().subscribe({
      next: (res: any) => {
        if (res?.isSuccess && Array.isArray(res.data)) {
          this.levelsStatisticsData = res.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            assignedCandidatesCount: item.assignedCandidatesCount,
          }));

          // Render the chart after the data is loaded
          this.renderLevelsChart();
        }
      },
      error: (err) => {
        console.error('Error fetching level statistics:', err);
      },
    });
  }

  renderLevelsChart() {
    const ctx = document.getElementById('levelsChart') as HTMLCanvasElement;
    if (!ctx || !this.levelsStatisticsData.length) return;

    const labels = this.levelsStatisticsData.map((l) => l.name);
    const values = this.levelsStatisticsData.map(
      (l) => l.assignedCandidatesCount
    );

    const maxValue = Math.max(...values);

    const roundedMax =
      maxValue <= 10
        ? 10
        : maxValue <= 100
          ? Math.ceil(maxValue / 10) * 10
          : Math.ceil(maxValue / 100) * 100;

    const stepSize = roundedMax / 10;

    const data = {
      labels,
      datasets: [
        {
          label: 'Assigned Candidates',
          data: values,
          backgroundColor: '#61B1C7',
          borderRadius: 6,
          barThickness: 24,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: roundedMax,
            ticks: {
              stepSize: stepSize,
              callback: function (value) {
                const numericValue = Number(value);
                if (numericValue >= 1000) {
                  return numericValue / 1000 + 'K';
                }
                return numericValue;
              },
            },
            title: {
              display: true,
              text: 'Assigned Candidates',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Levels',
            },
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
    }
  }
}
