import { Category, CategoryRepository } from "#category/domain";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import UniqueEntityId from "#seedwork/domain/value-object/unique-entity-id.vo";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import { setupSequelize } from "../../../../@seedwork/infra/db/testing/helpers/db";
import { Chance } from "chance";
import { CategoryModelMapper } from "./category-mapper";
import { Console } from "console";

describe("category sequelize repository unit test", () => {
  const _chance = Chance();
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should be inserts a category", async () => {
    let category = new Category({ name: "some name" });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "some name",
      description: "some description",
      is_active: false,
    });
    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
    const uuid = new UniqueEntityId();
    await expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${uuid}`)
    );
  });

  it("should finds a entity by id", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all  categories", async () => {
    const entity = new Category({ name: "some name" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  describe("search method test", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: _chance.guid({ version: 4 }),
          name: "Movie",
          description: null,
          is_active: true,
          created_at,
        }));
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      expect(searchOutput).toBeInstanceOf(
        CategoryRepository.CategorySearchResult
      );
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          is_active: true,
          created_at: created_at,
        })
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: _chance.guid({ version: 4 }),
          name: `Movie${index}`,
          description: null,
          is_active: true,
          created_at: new Date(created_at.getTime() + index),
        }));
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      searchOutput.items.reverse().forEach((item, index) => {
        expect(`${item.name}${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const categoryProps = [
        { id: _chance.guid({ version: 4 }), name: "test", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "B", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "Movie", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "MOVIE", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "mOvIe", ...defaultProps },
        {
          id: _chance.guid({ version: 4 }),
          name: "dale de mais",
          ...defaultProps,
        },
      ];

      const categories = await CategoryModel.bulkCreate(categoryProps);
      let result = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: "MOVIE",
        })
      );
      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new CategoryRepository.CategorySearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[2]),
              CategoryModelMapper.toEntity(categories[3]),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "MOVIE",
          }).toJSON(true)
        )
      );
      result = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          filter: "MOVIE",
        })
      );
      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new CategoryRepository.CategorySearchResult({
            items: [CategoryModelMapper.toEntity(categories[4])],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "MOVIE",
          }).toJSON(true)
        )
      );
    });

    it("should apply paginate and sort", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const categoryProps = [
        { id: _chance.guid({ version: 4 }), name: "b", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "c", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "e", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "d", ...defaultProps },
        { id: _chance.guid({ version: 4 }), name: "f", ...defaultProps },
      ];
      const categories = await CategoryModel.bulkCreate(categoryProps);

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.CategorySearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[1]),
              CategoryModelMapper.toEntity(categories[0]),
            ],
            per_page: 2,
            current_page: 1,
            total: 6,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.CategorySearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[2]),
              CategoryModelMapper.toEntity(categories[4]),
            ],
            per_page: 2,
            current_page: 2,
            total: 6,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.CategorySearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[5]),
              CategoryModelMapper.toEntity(categories[3]),
            ],
            per_page: 2,
            current_page: 1,
            total: 6,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.CategorySearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[4]),
              CategoryModelMapper.toEntity(categories[2]),
            ],
            per_page: 2,
            current_page: 2,
            total: 6,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const item of arrange) {
        let result = await repository.search(item.params);
        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });
  });
});
