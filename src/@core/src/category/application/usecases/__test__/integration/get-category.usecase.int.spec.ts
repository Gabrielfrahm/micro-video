import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import GetCategoryUseCase from "../../get-category.usecase";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/db/testing/helpers/db";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("get category use case integration test", () => {
  let repository: CategorySequelize.CategorySequelizeRepository;
  let useCase: GetCategoryUseCase.UseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
  });

  it("should returns a category", async () => {
    const model = await CategoryModel.factory().create();
    let output = await useCase.execute({ id: model.id });
    const entity = await CategoryModel.findByPk(model.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  });
});
