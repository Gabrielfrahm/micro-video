import UseCase from "../../../@seedwork/application/usecase";
import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput } from "../dtos/category.dto";
import CategoryOutputMapper from "../mappers/category-output.mapper";

export default class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    return CategoryOutputMapper.toOutPut(entity);
  }
}

export type Input = {
  id: string;
};

export type Output = CategoryOutput;
