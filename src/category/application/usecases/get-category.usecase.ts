import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput } from "../dtos/category.dto";

export default class GetCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<output> {
    const entity = await this.categoryRepository.findById(input.id);
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
  id: string;
};

export type output = CategoryOutput;
