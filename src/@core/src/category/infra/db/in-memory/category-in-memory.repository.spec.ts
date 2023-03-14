import { Category } from "../../../domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe("Category in memory repository unit tests", () => {
  let repository: CategoryInMemoryRepository;
  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  describe("apply filter method", () => {
    it("should no filter items when filter param is null", async () => {
      const items = [
        new Category({ name: "Movie" }),
        new Category({ name: "Animation" }),
        new Category({ name: "Movie" }),
        new Category({ name: "Anime" }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter items", async () => {
      const items = [
        new Category({ name: "Movie" }),
        new Category({ name: "Animation" }),
        new Category({ name: "Animation" }),
        new Category({ name: "Movie" }),
        new Category({ name: "Anime" }),
        new Category({ name: "Animation" }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");

      let itemsFiltered = await repository["applyFilter"](items, "Movie");
      expect(itemsFiltered).toHaveLength(2);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(itemsFiltered).toStrictEqual([items[0], items[3]]);

      itemsFiltered = await repository["applyFilter"](items, "Animation");
      expect(itemsFiltered).toHaveLength(3);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
      expect(itemsFiltered).toStrictEqual([items[1], items[2], items[5]]);

      itemsFiltered = await repository["applyFilter"](items, "Anime");
      expect(itemsFiltered).toHaveLength(1);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
      expect(itemsFiltered).toStrictEqual([items[4]]);
    });
  });

  describe("apply method sort", () => {
    it("should sort by created_at  when sort params is null", async () => {
      const items = [
        new Category({
          name: "Movie",
          created_at: new Date(2023, 1, 24, 14, 20),
        }),
        new Category({
          name: "Animation",
          created_at: new Date(2023, 1, 24, 14, 21),
        }),
        new Category({
          name: "Animation",
          created_at: new Date(2023, 1, 24, 14, 22),
        }),
        new Category({
          name: "Movie",
          created_at: new Date(2023, 1, 24, 14, 23),
        }),
        new Category({
          name: "Anime",
          created_at: new Date(2023, 1, 24, 14, 24),
        }),
        new Category({
          name: "Animation",
          created_at: new Date(2023, 1, 24, 14, 25),
        }),
      ];
      const itemsSorted = await repository["applySort"](items, null, null);

      expect(itemsSorted).toStrictEqual([
        items[5],
        items[4],
        items[3],
        items[2],
        items[1],
        items[0],
      ]);
    });

    it("should sort items by name", async () => {
      const items = [
        new Category({
          name: "Movie",
        }),
        new Category({
          name: "Animation",
        }),
        new Category({
          name: "Animation",
        }),
        new Category({
          name: "Movie",
        }),
        new Category({
          name: "Anime",
        }),
        new Category({
          name: "Animation",
        }),
      ];
      let itemsSorted = await repository["applySort"](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([
        items[1],
        items[2],
        items[5],
        items[4],
        items[0],
        items[3],
      ]);

      itemsSorted = await repository["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([
        items[0],
        items[3],
        items[4],
        items[1],
        items[2],
        items[5],
      ]);
    });
  });
});
