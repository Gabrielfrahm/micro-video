import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from 'core/category/application';
import { SortDirection } from 'core/@seedwork/domain';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { CategoryPresenter } from '../../presenter/category-presenter';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a new category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = mockCreateUseCase as any;

    const input: CreateCategoryDto = {
      name: 'some name',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
    // expect(output).toEqual(result);
  });

  it('should update a new category', async () => {
    const id = '97169dd3-afb7-4372-ad7b-5630ec2b6a81';
    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['updateUseCase'] = mockUpdateUseCase as any;

    const input: UpdateCategoryDto = {
      name: 'some name',
      description: 'some description',
      is_active: true,
    };

    const result = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });

    expect(output).toStrictEqual({ id, ...result });
  });

  it('should delete a category', async () => {
    const output = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
    };
    controller['deleteUseCase'] = mockDeleteUseCase as any;
    const result = await controller.remove(input.id);
    expect(mockDeleteUseCase.execute).toBeCalledWith(input);
    expect(controller.remove(input.id)).toBeInstanceOf(Promise);
    expect(result).toStrictEqual(output);
  });

  it('should get a category', async () => {
    const id = '97169dd3-afb7-4372-ad7b-5630ec2b6a81';
    const output: GetCategoryUseCase.Output = {
      id,
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input: GetCategoryUseCase.Input = {
      id,
    };
    controller['getUseCase'] = mockGetUseCase as any;
    const result = await controller.findOne(input.id);
    expect(controller.findOne(input.id)).toBeInstanceOf(Promise);
    expect(mockGetUseCase.execute).toBeCalledWith(input);
    expect(result).toEqual(output);
  });

  it('should list all category', async () => {
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
          name: 'some name',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input: ListCategoriesUseCase.Input = {
      page: 1,
      filter: 'test',
      per_page: 2,
      sort: 'asc' as SortDirection,
    };

    controller['listUseCase'] = mockListUseCase as any;
    const result = await controller.search(input);
    expect(controller.search(input)).toBeInstanceOf(Promise);
    expect(mockListUseCase.execute).toBeCalledWith(input);
    expect(result).toStrictEqual(output);
  });
});
