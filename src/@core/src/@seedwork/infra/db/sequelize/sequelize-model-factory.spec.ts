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
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory
    );
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

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();

    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "test",
    }));
    expect(models[0].id).toBe("9366b7dc-2d71-4799-b91c-c64adb205104");
    expect(models[0].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkCreate();

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(models[0].id).not.toBe(models[1].name);
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound1.id);
    expect(models[0].name).toBe(modelFound1.name);

    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toBe(modelFound2.id);
    expect(models[1].name).toBe(modelFound2.name);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: "test",
      }));
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe("test");
    expect(models[1].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });

  test("bulkMake method using count = 1", async () => {
    let models = StubModel.factory().bulkMake();

    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    models = StubModel.factory().bulkMake(() => ({
      id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "test",
    }));

    expect(models).toHaveLength(1);
    expect(models[0].id).toBe("5490020a-e866-4229-9adc-aa44b83234c4");
    expect(models[0].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkMake method using count > 1", async () => {
    let models = StubModel.factory().count(2).bulkMake();

    expect(models).toHaveLength(2);
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(models[0].id).not.toBe(models[1].name);

    models = StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: chance.guid({ version: 4 }),
        name: "test",
      }));

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe("test");
    expect(models[1].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });
});
