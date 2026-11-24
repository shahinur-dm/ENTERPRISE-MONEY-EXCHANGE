import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((payload) => {
        // If response is already formatted or has custom structure
        if (payload && payload.success !== undefined && payload.statusCode !== undefined) {
          return payload;
        }

        let data = payload;
        let meta = undefined;

        if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
          data = payload.data;
          meta = payload.meta;
        }

        return {
          success: true,
          statusCode: response.statusCode || 200,
          data,
          meta,
          timestamp: new Date().toISOString(),
        };
      })
    );
  }
}
