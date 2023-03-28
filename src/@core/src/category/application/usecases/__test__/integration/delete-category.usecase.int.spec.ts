import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import { Category } from "../../../../domain/entities/category";
import CategoryInMemoryRepository from "../../../../infra/db/in-memory/category-in-memory.repository";
import CreateCategoryUseCase from "../../create-category.usecase";
import DeleteCategoryUseCase from "../../delete-category.usecase";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("delete category use case integration test", () => {
  let repository: CategorySequelize.CategorySequelizeRepository;
  let useCase: DeleteCategoryUseCase.UseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should delete a category", async () => {
    const model = await CategoryModel.factory().create();

    await useCase.execute({ id: model.id });
    const response = await CategoryModel.findByPk(model.id);
    expect(response).toBeNull();
  });
});
