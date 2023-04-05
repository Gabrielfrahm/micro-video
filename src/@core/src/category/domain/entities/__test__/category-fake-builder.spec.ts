import { CategoryFakeBuilder } from "../category-fake-builder";
import { Chance } from "chance";
describe("Category fake builder unit test", () => {
  describe("name prop", () => {
    const faker = CategoryFakeBuilder.aCategory();
    it("should be a function", () => {
      expect(typeof faker["_name"] === "function").toBeTruthy();
    });

    it("should call the word method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();
      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withName", () => {
      faker.withName("some name");
      expect(faker["_name"]).toBe("some name");
      faker.withName(() => "some name");
      //@ts-ignore name is callable
      expect(faker["_name"]()).toBe("some name");
    });

    it("should pass index to name factory", () => {
      faker.withName((index) => `some name ${index}`);

      const category = faker.build();
      expect(category.name).toBe("some name 0");

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `some name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe("some name 0");

      expect(categories[1].name).toBe("some name 1");
    });
  });
  describe("description prop", () => {
    const faker = CategoryFakeBuilder.aCategory();
    it("should be a function", () => {
      expect(typeof faker["_description"] === "function").toBeTruthy();
    });

    it("should call the Paragraph method", () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, "paragraph");
      faker["chance"] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test("withDescription", () => {
      faker.withDescription("some description");
      expect(faker["_description"]).toBe("some description");
      faker.withDescription(() => "some description");
      //@ts-ignore description is callable
      expect(faker["_description"]()).toBe("some description");
    });

    it("should pass index to description factory", () => {
      faker.withDescription((index) => `some description ${index}`);

      const category = faker.build();
      expect(category.description).toBe("some description 0");

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withDescription((index) => `some description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe("some description 0");

      expect(categories[1].description).toBe("some description 1");
    });
  });

  describe("is_active props", () => {
    const faker = CategoryFakeBuilder.aCategory();
    it("activate", () => {
      faker.activate();
      expect(faker["_is_active"]).toBeTruthy();
    });

    it("deactivate", () => {
      faker.deactivate();
      expect(faker["_is_active"]).toBeFalsy();
    });
  });
});
