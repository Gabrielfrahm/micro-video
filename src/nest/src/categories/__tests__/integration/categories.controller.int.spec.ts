import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesModule } from '../../categories.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  DeleteCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from 'core/category/application';
import { CategoryRepository } from 'core/category/domain';
import { CATEGORY_PROVIDERS } from '../../categories.providers';
import { CategorySequelize } from 'core/category/infra';
import { NotFoundError } from 'core/@seedwork/domain';
import { CategoryPresenter } from '../../presenter/category-presenter';

describe('Categories Controller integration test', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        CategoriesModule,
      ],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
  });

  it('should create a category', async () => {
    const presenter = await controller.create({
      name: 'Some name',
    });
    const entity = await repository.findById(presenter.id);

    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter.id).toBe(entity.id);
    expect(presenter.name).toBe('Some name');
    expect(presenter.description).toBeNull();
    expect(presenter.is_active).toBeTruthy();
    expect(presenter.created_at).toStrictEqual(entity.created_at);
  });

  describe('should update a category', () => {
    it('test', async () => {
      const category = await CategorySequelize.CategoryModel.factory().create({
        id: 'eab81ef5-f395-4ed9-9776-d2cb4775dbbe',
        name: 'Movie',
        description: null,
        is_active: true,
        created_at: new Date(),
      });
      const presenter = await controller.update(category.id, {
        name: 'updated',
      });
      const entity = await repository.findById(presenter.id);
      expect(entity).toMatchObject({
        id: presenter.id,
        name: 'updated',
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
      });

      expect(presenter).toBeInstanceOf(CategoryPresenter);
      expect(presenter.id).toBe(entity.id);
      expect(presenter.name).toBe('updated');
      expect(presenter.description).toBeUndefined();
      expect(presenter.is_active).toBe(category.is_active);
      expect(presenter.created_at).toStrictEqual(category.created_at);
    });
  });

  it('should delete a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create({
      id: 'eab81ef5-f395-4ed9-9776-d2cb4775dbbe',
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: new Date(),
    });

    const response = await controller.remove(category.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${category.id}`),
    );
  });
  it('should get a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create({
      id: 'eab81ef5-f395-4ed9-9776-d2cb4775dbbe',
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: new Date(),
    });
    const presenter = await controller.findOne(category.id);
    const entity = await repository.findById(presenter.id);

    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter.id).toBe(entity.id);
    expect(presenter.name).toBe(entity.name);
    expect(presenter.description).toBe(entity.description);
    expect(presenter.is_active).toBe(entity.is_active);
    expect(presenter.created_at).toStrictEqual(entity.created_at);
  });
});
