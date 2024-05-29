import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
  imports: [HttpModule],
})
export class CommonModule {}
