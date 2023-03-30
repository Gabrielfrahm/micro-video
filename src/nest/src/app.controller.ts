import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

// import { CreateCategoryUseCase } from 'core/category/application';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    // console.log(CreateCategoryUseCase);
    // console.log(this.configService);
    return this.appService.getHello();
  }
}
