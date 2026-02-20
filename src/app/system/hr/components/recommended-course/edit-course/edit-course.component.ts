import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { editCourse } from '../../../models/interfaces/recommended-courses-view-model';
import { HrService } from '../../../services/hr.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { RecommendedCoursesService } from '../../../services/recommended-courses/recommended-courses.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    AvatarModule,
    DialogModule,
    ReactiveFormsModule,
  ],
})
export class EditCourseComponent implements OnInit {
  @Input() course!: editCourse;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @Input('editVisible') set editVisible(val: boolean) {
    this.visible = val;
  }
  @Output('editVisibleChange') editVisibleChange = new EventEmitter<boolean>();
  visible = true;
  editCourseForm!: FormGroup;
  courseId!: string;
  constructor(
    private fb: FormBuilder,
    private _hrService: HrService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private _recommendedCoursesService: RecommendedCoursesService
  ) {}

  ngOnInit(): void {
    this.courseId =
      this.course?.id || this.route.snapshot.paramMap.get('id') || '';
    this.editCourseForm = this.fb.group({
      id: [this.courseId],
      name: [this.course?.name, [Validators.required, Validators.minLength(2)]],
      hours: [this.course?.hours, [Validators.required]],
      instructorName: [
        this.course?.instructorName,
        [Validators.required, Validators.minLength(2)],
      ],
      courseClassification: [this.course?.courseClassification],
      status: [this.course?.status],
      hasExam: [this.course?.hasExam],
      courseType: [this.course?.courseType],
      link: [this.course?.link],
      content: [this.course?.content],
      paths: [this.course?.paths],
    });
  }

  onSave() {
    if (this.editCourseForm.valid) {
      const body: editCourse = this.editCourseForm.value;

      this._recommendedCoursesService.editCourse(body).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.updated.emit();
            this.close.emit();

            this.router.navigate([
              `/hr/recommendedCourses/courseDetails/${this.courseId}`,
            ]);
            this.closeDialog();
          }
        },
      });
    } else {
      this.editCourseForm.markAllAsTouched();
    }
  }

  closeDialog() {
    this.visible = false;
    this.editVisibleChange.emit(false);
    this.close.emit();
  }

  cancel() {
    this.closeDialog();
  }
}
