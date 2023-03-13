import { default as DefaultUseCase } from "../../../@seedwork/application/usecase";

import CategoryRepository from "../../../category/domain/repository/category.repository";
import { CategoryOutput } from "../dtos/category.dto";
import CategoryOutputMapper from "../mappers/category-output.mapper";

export namespace UpdateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);
      entity.update({ name: input.name, description: input.description });

      if (input.is_active === true) {
        entity.activate();
      }

      if (input.is_active === false) {
        entity.deactivate();
      }

      await this.categoryRepository.update(entity);
      return CategoryOutputMapper.toOutPut(entity);
    }
  }

  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;
}

export default UpdateCategoryUseCase;
