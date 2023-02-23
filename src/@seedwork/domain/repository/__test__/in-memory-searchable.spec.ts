import Entity from "../../../../@seedwork/domain/entity/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ["name"];
  protected async applyFilter(
    items: StubEntity[],
    filter: string
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.props.name
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase()) ||
        item.props.price.toString() === filter
      );
    });
  }
}

describe("InMemorySearchableRepository", () => {
  let repository: StubInMemorySearchableRepository;
  beforeEach(() => (repository = new StubInMemorySearchableRepository()));

  describe("Apply Filter method", () => {
    it("should no filter items when filter param is null", async () => {
      const items = [new StubEntity({ name: "Some name", price: 5 })];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "Some name", price: 5 }),
        new StubEntity({ name: "Fake name", price: 2 }),
        new StubEntity({ name: "Some name Test", price: 10 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      let itemsFiltered = await repository["applyFilter"](items, "Some name");
      expect(itemsFiltered).toStrictEqual([items[0], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository["applyFilter"](items, "5");
      expect(itemsFiltered).toStrictEqual([items[0]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository["applyFilter"](items, "non-filter");
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe("Apply sort method", () => {});
  describe("Apply paginate method", () => {});
  describe("search method", () => {});
});
