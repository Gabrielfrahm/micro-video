import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/db/testing/helpers/db";
import { NotFoundError } from "../../../../../@seedwork/domain/errors/not-found.error";

import UpdateCategoryUseCase from "../../update-category.usecase";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;
describe("Update Category UseCase integration Tests", () => {
  let repository: CategorySequelize.CategorySequelizeRepository;
  let useCase: UpdateCategoryUseCase.UseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id", name: "fake" })
    ).rejects.toThrow(new NotFoundError(`Entity Not Found Using ID fake id`));
  });

  it("should update a category", async () => {
    const model = await CategoryModel.factory().create();

    let output = await useCase.execute({ id: model.id, name: "test" });
    expect(output).toStrictEqual({
      id: model.id,
      name: "test",
      description: undefined,
      is_active: true,
      created_at: model.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: model.id,
          name: "test",
          description: "some description",
        },
        expected: {
          id: model.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "test",
        },
        expected: {
          id: model.id,
          name: "test",
          description: undefined,
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "test",
          is_active: false,
        },
        expected: {
          id: model.id,
          name: "test",
          description: undefined,
          is_active: false,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "test",
        },
        expected: {
          id: model.id,
          name: "test",
          description: undefined,
          is_active: false,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "test",
          is_active: true,
        },
        expected: {
          id: model.id,
          name: "test",
          description: undefined,
          is_active: true,
          created_at: model.created_at,
        },
      },
      {
        input: {
          id: model.id,
          name: "test",
          description: "some description",
          is_active: false,
        },
        expected: {
          id: model.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: model.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        description: i.input.description,
        is_active: i.input.is_active,
      });
      expect(output).toStrictEqual({
        id: model.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
