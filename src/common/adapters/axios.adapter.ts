import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import { catchError, firstValueFrom } from 'rxjs';

import { AxiosError } from 'axios';
import { HttAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttAdapter {
  private readonly logger = new Logger(AxiosAdapter.name);

  constructor(private readonly httpSrv: HttpService) {
    this.httpSrv.axiosRef.defaults.httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Only in development
    });
  }

  async get<T>(url: string): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpSrv.get<T>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
