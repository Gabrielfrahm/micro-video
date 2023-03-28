import { setupSequelize } from "../../../../@seedwork/infra/db/testing/helpers/db";
import { DataType, Sequelize } from "sequelize-typescript";
import { CategorySequelize } from "./category-sequelize";

describe("Category unit test", () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  test("mapping props", () => {
    const attributesMap = CategorySequelize.CategoryModel.getAttributes();
    const attributes = Object.keys(
      CategorySequelize.CategoryModel.getAttributes()
    );
    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

    const idAttr = attributesMap.id;
    expect(idAttr).toMatchObject({
      field: "id",
      fieldName: "id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createAtAttr = attributesMap.created_at;
    expect(createAtAttr).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      allowNull: false,
      type: DataType.DATE(),
    });
  });

  test("create category", async () => {
    const arrange = {
      id: "d1ef5ca3-ad63-4bfb-8120-d7ea5a2bed92",
      name: "some name",
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategorySequelize.CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
