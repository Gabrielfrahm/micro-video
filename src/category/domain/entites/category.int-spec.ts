import ValidatorError from "../../../@seedwork/errors/validator.error";
import { Category } from "./category";

describe("Category Integration Test", () => {
  describe("created method", () => {
    it("should a invalid category using name property", () => {
      expect(() => new Category({ name: null })).toThrow(
        new ValidatorError("The name is required")
      );
      expect(() => new Category({ name: "" })).toThrow(
        new ValidatorError("The name is required")
      );
      expect(() => new Category({ name: undefined })).toThrow(
        new ValidatorError("The name is required")
      );
      expect(() => new Category({ name: 5 as any })).toThrow(
        new ValidatorError("The name must be a string")
      );
      expect(() => new Category({ name: "t".repeat(256) })).toThrow(
        new ValidatorError("The name must less or equal than 255 characters")
      );
    });

    it("should a invalid category using description property", () => {
      expect(
        () => new Category({ name: "Movie", description: 5 as any })
      ).toThrow(new ValidatorError("The description must be a string"));
    });
    it("should a invalid category using boolean property", () => {
      expect(
        () => new Category({ name: "Movie", is_active: "" as any })
      ).toThrow(new ValidatorError("The is_active must be a boolean"));
    });

    it("should a valid category", () => {
      expect.assertions(0);
      new Category({ name: "some name" });
      new Category({ name: "some name", description: "some description" });
      new Category({ name: "some name", description: null });
      new Category({
        name: "some name",
        description: "some description",
        is_active: false,
      });
      new Category({
        name: "some name",
        description: "some description",
        is_active: true,
      });
    });
  });

  describe("update method", () => {
    it("should a invalid category using name property", () => {
      const category = new Category({ name: "Movie" });
      expect(() => category.update({ name: null })).toThrow(
        new ValidatorError("The name is required")
      );
      expect(() => category.update({ name: "" })).toThrow(
        new ValidatorError("The name is required")
      );
      expect(() => category.update({ name: undefined })).toThrow(
        new ValidatorError("The name is required")
      );
      expect(() => category.update({ name: 5 as any })).toThrow(
        new ValidatorError("The name must be a string")
      );
      expect(() => category.update({ name: "t".repeat(256) })).toThrow(
        new ValidatorError("The name must less or equal than 255 characters")
      );
    });

    it("should a invalid category using description property", () => {
      const category = new Category({ name: "Movie" });

      expect(() =>
        category.update({ name: "Movie", description: 5 as any })
      ).toThrow(new ValidatorError("The description must be a string"));
    });

    it("should a valid category", () => {
      expect.assertions(0);
      const category = new Category({ name: "some name" });
      category.update({ name: "some name", description: "some description" });
      category.update({ name: "some name", description: null });
      category.update({
        name: "some name",
        description: "some description",
      });
    });
  });
});
