import { default as DefaultUseCase } from "../../../@seedwork/application/usecase";
import { Category } from "../../../category/domain/entities/category";
import CategoryRepository from "../../../category/domain/repository/category.repository";
import { CategoryOutput } from "../dtos/category.dto";
import CategoryOutputMapper from "../mappers/category-output.mapper";

export namespace CreateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = new Category(input);
      await this.categoryRepository.insert(entity);
      return CategoryOutputMapper.toOutPut(entity);
    }
  }

  export type Input = {
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;
}

export default CreateCategoryUseCase;
