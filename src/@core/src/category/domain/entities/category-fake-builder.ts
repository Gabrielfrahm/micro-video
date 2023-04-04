import { Category } from "./category";
import { Chance } from "chance";

class CategoryFakeBuilder {
  private chance: Chance.Chance;
  private name: string | (() => string) = () => this.chance.word();
  private description: string | (() => string) = () => this.chance.paragraph();
  private is_active: boolean | (() => boolean) = true;

  static aCategory() {
    return new CategoryFakeBuilder();
  }

  constructor() {
    this.chance = Chance();
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  withDescription(description: string) {
    this.description = description;
    return this;
  }

  active() {
    this.is_active = true;
    return this;
  }

  deactivate() {
    this.is_active = false;
    return this;
  }

  build() {
    return new Category({
      name: typeof this.name === "function" ? this.name() : this.name,
      description:
        typeof this.description === "function"
          ? this.description()
          : this.description,
      is_active:
        typeof this.is_active === "function"
          ? this.is_active()
          : this.is_active,
    });
  }
}
