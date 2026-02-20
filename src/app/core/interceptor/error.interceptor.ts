import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ApiErrorCode } from '../models/enums/apiErrorCode';

@Injectable()
export class ErrorCodeInterceptor implements HttpInterceptor {
  constructor(private readonly messageService: MessageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;

          const errorCode = body?.errorCode;

          if (
            typeof errorCode === 'number' &&
            errorCode !== ApiErrorCode.None
          ) {
            const errorMessage = this.getMessageByCode(
              errorCode,
              body?.message
            );

            // Show toast
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: errorMessage,
            });

            throw new Error(errorMessage);
          }
        }

        return event;
      }),

      catchError((error) => {
        console.error('ErrorCodeInterceptor catchError:', error);
        return throwError(() => error);
      })
    );
  }

  private getMessageByCode(
    code: number,
    fallback: string = 'حدث خطأ غير متوقع'
  ): string {
    switch (code) {
      case ApiErrorCode.Unauthorize:
        return 'رمز الدخول غير صالح';
      case ApiErrorCode.NotFound:
        return 'المستخدم غير موجود';
      case ApiErrorCode.CannotEdit:
        return 'ليس لديك صلاحية للقيام بهذا الإجراء';
      case ApiErrorCode.UnauthorizeTokenIsBlackListed:
        return 'فشل التحقق من صحة البيانات';
      case ApiErrorCode.ExistEmail:
        return 'البريد الالكتروني موجود بالفعل';
      case ApiErrorCode.ExistMobile:
        return 'الموبايل موجود بالفعل';
      case ApiErrorCode.ExistNationalNumber:
        return 'الرقم القومي موجود بالفعل';
      default:
        return fallback;
    }
  }
}
