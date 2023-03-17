import { Category } from "#category/domain";
import { LoadEntityError } from "#seedwork/domain";
import UniqueEntityId from "#seedwork/domain/value-object/unique-entity-id.vo";
import { setupSequelize } from "../../../../@seedwork/infra/db/testing/helpers/db";
import { CategoryModelMapper } from "./category-mapper";
import { CategoryModel } from "./category-model";
describe("Category model mapper unit test", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      id: "7f1b37fe-e6c1-4a78-a3fd-ebc2cc993886",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid, but it needs throws a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", async () => {
    const error = new Error("Generic error");
    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementationOnce(() => {
        throw error;
      });
    const model = CategoryModel.build({
      id: "7f1b37fe-e6c1-4a78-a3fd-ebc2cc993886",
    });
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
  });

  it("should convert a category model to a category entity", async () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: "7f1b37fe-e6c1-4a78-a3fd-ebc2cc993886",
      name: "some name",
      description: "some description",
      is_active: true,
      created_at,
    });
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: "some name",
          description: "some description",
          is_active: true,
          created_at,
        },
        new UniqueEntityId("7f1b37fe-e6c1-4a78-a3fd-ebc2cc993886")
      ).toJSON()
    );
  });
});
