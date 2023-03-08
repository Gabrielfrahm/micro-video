import { Category } from "../../../category/domain/entities/category";
import CategoryOutputMapper from "./category-output.mapper";

describe("Category output mapper unit test", () => {
  it("Should convert a category in output", () => {
    const created_at = new Date();
    const entity = new Category({
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at,
    });

    const spyToJson = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutPut(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.id,
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at,
    });
  });
});
