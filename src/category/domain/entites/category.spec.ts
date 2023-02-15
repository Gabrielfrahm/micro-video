import { Category } from "./category";

describe("Category Unit Tests", () => {
  test("constructor of category", () => {
    const props = {
      name: "Movie",
      description: "Description",
      is_active: true,
      created_at: new Date(),
    };
    const category = new Category(props);
    expect(category.props).toStrictEqual(props);
  });

  test("getter of name field", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");
  });
  test("getter and setter  of description field", () => {
    let category = new Category({ name: "Movie" });
    expect(category.description).toBeNull();
    category = new Category({
      name: "Movie",
      description: "Some description",
    });
    expect(category.description).toBe("Some description");

    category["description"] = "Other description";
    expect(category.description).toBe("Other description");

    category["description"] = undefined;
    expect(category.description).toBeNull();
  });
});
