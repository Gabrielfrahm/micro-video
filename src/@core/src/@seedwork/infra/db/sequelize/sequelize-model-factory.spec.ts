import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import _chance from "chance";
import { Sequelize } from "sequelize-typescript";
import { setupSequelize } from "../testing/helpers/db";

const chance = _chance();

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
  }
}

describe("sequelize model factory unit test", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(model.id).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: "0e77d02c-6efa-4ecc-8d0e-0a51add47edb",
      name: "some name",
    });
    expect(model.id).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
  });

  test("make method", async () => {
    let model = await StubModel.factory().make();
    expect(model.id).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    model = await StubModel.factory().make({
      id: "0e77d02c-6efa-4ecc-8d0e-0a51add47edb",
      name: "some name",
    });
    expect(model.id).toBe("0e77d02c-6efa-4ecc-8d0e-0a51add47edb");
    expect(model.name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });
});
