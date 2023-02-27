import CategoryInMemoryRepository from "../../../category/infra/repository/category-in-memory.repository";
import CreateCategoryUseCase from "../usecases/create-category.usecase";

describe("create category use case unit test", () => {
  let repository: CategoryInMemoryRepository;
  let useCase: CreateCategoryUseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a category", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "some name" });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "some name",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: "some name",
      description: "some description",
      is_active: false,
    });
    expect(spyRepository).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: "some name",
      description: "some description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
  });
});
