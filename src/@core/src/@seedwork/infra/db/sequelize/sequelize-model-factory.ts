export class SequelizeModelFactory {
  private _count = 1;

  constructor(private model, private DefaultFactoryProps: () => any) {}
  count(count: number) {
    this._count = count;
    return this;
  }

  async create(data?) {
    return await this.model.create(data ? data : this.DefaultFactoryProps());
  }

  make(data?) {
    return this.model.build(data ? data : this.DefaultFactoryProps());
  }

  async bulkCreate(factoryProps?: (index: number) => any) {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.DefaultFactoryProps())
      .map((factory, index) => factory(index));
    return this.model.bulkCreate(data);
  }

  bulkMake() {}
}
