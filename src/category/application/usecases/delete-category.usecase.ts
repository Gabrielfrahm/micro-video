import UseCase from "../../../@seedwork/application/usecase";
import CategoryRepository from "../../../category/domain/repository/category.repository";

export default class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.delete(input.id);
    return;
  }
}

export type Input = {
  id: string;
};

export type Output = void;
