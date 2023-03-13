import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
} from 'core/category/application';
import { CategoryInMemoryRepository } from 'core/category/infra';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryInMemoryRepository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepository);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepository: CategoryInMemoryRepository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepository);
      },
      inject: ['CategoryInMemoryRepository'],
    },
  ],
})
export class CategoriesModule {}
