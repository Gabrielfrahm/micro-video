import { Model } from "sequelize-typescript";

export class SequelizeModelFactory<ModalClass extends Model, ModalProps = any> {
  private _count = 1;

  constructor(private model, private DefaultFactoryProps: () => ModalProps) {}
  count(count: number) {
    this._count = count;
    return this;
  }

  async create(data?: ModalProps): Promise<ModalClass> {
    return await this.model.create(data ? data : this.DefaultFactoryProps());
  }

  make(data?: ModalProps): ModalClass {
    return this.model.build(data ? data : this.DefaultFactoryProps());
  }

  async bulkCreate(
    factoryProps?: (index: number) => ModalProps
  ): Promise<ModalClass[]> {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.DefaultFactoryProps)
      .map((factory, index) => factory(index));
    return this.model.bulkCreate(data);
  }

  bulkMake(factoryProps?: (index: number) => ModalProps): ModalClass[] {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.DefaultFactoryProps)
      .map((factory, index) => factory(index));
    return this.model.bulkBuild(data);
  }
}
