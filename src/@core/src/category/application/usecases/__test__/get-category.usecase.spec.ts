import { Category } from "../../../../category/domain/entities/category";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";

import GetCategoryUseCase from "../get-category.usecase";

describe("get category use case unit test", () => {
  let repository: CategoryInMemoryRepository;
  let useCase: GetCategoryUseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    expect(useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
  });

  it("should returns a category", async () => {
    const items = [new Category({ name: "some name" })];
    repository.items = items;
    const spyRepository = jest.spyOn(repository, "findById");
    let output = await useCase.execute({ id: items[0].id });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "some name",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });
});
