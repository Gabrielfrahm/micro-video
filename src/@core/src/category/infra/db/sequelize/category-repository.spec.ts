import { Category } from "#category/domain";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import UniqueEntityId from "#seedwork/domain/value-object/unique-entity-id.vo";
import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import { setupSequelize } from "../../../../@seedwork/infra/db/testing/helpers/db";

describe("category sequelize repository unit test", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should be inserts a category", async () => {
    let category = new Category({ name: "some name" });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "some name",
      description: "some description",
      is_active: false,
    });
    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
    const uuid = new UniqueEntityId();
    await expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${uuid}`)
    );
  });

  it("should finds a entity by id", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all  categories", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it("should search categories", async () => {
    await CategoryModel.factory().create();
  });
});
