import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import { Chance } from "chance";
import { Index } from "sequelize-typescript";
import { Category } from "../../../../domain/entities/category";

import ListCategoriesUseCase from "../../list-categories.usecase";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("list categories use case integration test", () => {
  let repository: CategorySequelize.CategorySequelizeRepository;
  let useCase: ListCategoriesUseCase.UseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const _chance = Chance();
    const models = await CategoryModel.factory()
      .count(2)
      .bulkCreate((index: number) => {
        return {
          id: _chance.guid({ version: 4 }),
          name: `category ${index}`,
          description: "some description",
          is_active: true,
          created_at: new Date(new Date().getTime() + index),
        };
      });

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...models]
        .reverse()
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should return output using pagination, sort and filter", async () => {
    const models = CategoryModel.factory().count(5).bulkMake();
    models[0].name = "a";
    models[1].name = "AAA";
    models[2].name = "AaA";
    models[3].name = "b";
    models[4].name = "c";
    await CategoryModel.bulkCreate(models.map((m) => m.toJSON()));

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [models[1], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [models[0]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [models[0], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
