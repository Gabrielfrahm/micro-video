import { Category } from "../../../category/domain/entities/category";
import CategoryRepository from "../../../category/domain/repository/category.repository";
import { CategoryOutput } from "../dtos/category.dto";

export default class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<output> {
    const entity = new Category(input);
    await this.categoryRepository.insert(entity);
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type output = CategoryOutput;
