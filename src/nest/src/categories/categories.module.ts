import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { CategorySequelize } from 'core/category/infra';

import { CategoriesController } from './categories.controller';

import { CATEGORY_PROVIDERS } from './categories.providers';

@Module({
  imports: [SequelizeModule.forFeature([CategorySequelize.CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES),
  ],
})
export class CategoriesModule {}
