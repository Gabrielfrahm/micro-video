import { Category } from "../category";

describe("Category Integration Test", () => {
  describe("created method", () => {
    it("should a invalid category using name property", () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
      expect(() => new Category({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new Category({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a invalid category using description property", () => {
      expect(
        () => new Category({ name: null, description: 5 as any })
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should a invalid category using boolean property", () => {
      expect(
        () => new Category({ name: null, is_active: 5 as any })
      ).containsErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });
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
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
      expect(() => new Category({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new Category({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a invalid category using description property", () => {
      expect(
        () => new Category({ name: null, description: 5 as any })
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
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
