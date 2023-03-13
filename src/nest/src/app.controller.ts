import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { CreateCategoryUseCase } from 'core/category/application';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(CreateCategoryUseCase);

    return this.appService.getHello();
  }
}
