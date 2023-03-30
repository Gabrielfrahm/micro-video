import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/db/testing/helpers/db";

import CreateCategoryUseCase from "../../create-category.usecase";

const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;
describe("create category use case integration test", () => {
  let repository: CategorySequelize.CategorySequelizeRepository;
  let useCase: CreateCategoryUseCase.UseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  it("should create a category", async () => {
    let output = await useCase.execute({ name: "some name" });
    let entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: "some name",
      description: "some description",
      is_active: false,
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  });
});
