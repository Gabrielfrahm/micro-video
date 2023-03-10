import { Category } from "../../../../category/domain/entities/category";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import DeleteCategoryUseCase from "../delete-category.usecase";

describe("delete category use case unit test", () => {
  let repository: CategoryInMemoryRepository;
  let useCase: DeleteCategoryUseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("should delete a category", async () => {
    const items = [new Category({ name: "some name" })];
    repository.items = items;
    expect(repository.items).toHaveLength(1);
    const spyRepository = jest.spyOn(repository, "delete");
    await useCase.execute({ id: items[0].id });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});
