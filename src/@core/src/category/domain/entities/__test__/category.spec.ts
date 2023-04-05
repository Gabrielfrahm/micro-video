import { Category } from "../category";

import UniqueEntityId from "#seedwork/domain/value-object/unique-entity-id.vo";

describe("Category Unit Tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });
  test("constructor of category", () => {
    const props = {
      name: "Movie",
      description: "Description",
      is_active: true,
      created_at: new Date(),
    };
    const category = new Category(props);
    expect(Category.validate).toHaveBeenCalled();
    expect(category.props).toStrictEqual(props);
  });

  test("id field", () => {
    const data = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      { props: { name: "Movie" }, id: new UniqueEntityId() },
    ];

    data.forEach((i) => {
      const category = new Category(i.props, i.id);
      expect(category.id).not.toBeNull();
      // console.log(category.uniqueEntityId instanceof UniqueEntityId);
    });
  });

  test("getter of name field", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");
  });
  test("getter and setter of description field", () => {
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

    category["description"] = null;
    expect(category.description).toBeNull();
  });
  test("getter and setter of is_active field", () => {
    let category = new Category({ name: "Movie" });

    expect(category.is_active).toBeTruthy();
    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: false,
    });
    expect(category.is_active).toBeFalsy();
  });

  test("getter of created_at field", () => {
    let category = new Category({ name: "Movie" });

    expect(category.created_at).toBeInstanceOf(Date);
    let created_at = new Date();

    category = new Category({ name: "Movie", created_at });
    expect(category.created_at).toBe(created_at);
  });

  test("should be update name and description field", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();

    category.update({ name: "update name", description: "description update" });
    expect(Category.validate).toHaveBeenCalledTimes(2);

    expect(category.name).toBe("update name");
    expect(category.description).toBe("description update");
  });

  test("should be active category", () => {
    const category = new Category({ name: "Movie" });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
    expect(category.is_active).toBe(false);

    category.activate();
    expect(category.is_active).toBeTruthy();
    expect(category.is_active).toBe(true);
  });

  test("should be deactivate category", () => {
    const category = new Category({ name: "Movie" });

    expect(category.is_active).toBeTruthy();
    expect(category.is_active).toBe(true);

    category.deactivate();
    expect(category.is_active).toBeFalsy();
    expect(category.is_active).toBe(false);
  });
});
