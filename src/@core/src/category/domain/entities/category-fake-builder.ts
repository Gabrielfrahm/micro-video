import { Category } from "./category";
import { Chance } from "chance";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private chance: Chance.Chance;
  private countObjs = 1;
  private _unique_entity_id = undefined;
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  private _description: PropOrFactory<string> = (_index) =>
    this.chance.paragraph();
  private _is_active: PropOrFactory<boolean> = (_index) => true;
  private _created_at = undefined;

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }
  static theCategories(countObjs: number) {
    return new CategoryFakeBuilder<Category[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withUniqueEntityId(value?: PropOrFactory<string>) {
    this._unique_entity_id = value;
    return this;
  }

  withName(name: PropOrFactory<string>) {
    this._name = name;
    return this;
  }

  withDescription(description: PropOrFactory<string>) {
    this._description = description;
    return this;
  }

  withInvalidNameEmpty(value?: "" | null | undefined) {
    this._name = value;
    return this;
  }

  withInvalidNameNotString(value?: any) {
    this._name = value ?? 5;
    return this;
  }

  withInvalidNameIsToLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withInvalidDescriptionNotString(value?: any) {
    this._description = value ?? 5;
    return this;
  }

  withInvalidIsActiveEmpty(value?: "" | null | undefined) {
    this._name = value as any;
    return this;
  }

  withInvalidIsActiveNotBoolean(value?: any) {
    this._name = value ?? "fake boolean";
    return this;
  }

  withCreatedAt(value?: PropOrFactory<string>) {
    this._created_at = value;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category({
          ...(this._unique_entity_id && {
            unique_entity_id: this.callFactory(this._unique_entity_id, index),
          }),
          name: this.callFactory(this._name, index),
          description: this.callFactory(this._description, index),
          is_active: this.callFactory(this._is_active, index),
          ...(this._created_at && {
            unique_entity_id: this.callFactory(this._created_at, index),
          }),
        })
    );
    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  get unique_entity_id() {
    return this.getValue("unique_entity_id");
  }

  get name() {
    return this.getValue("name");
  }

  get description() {
    return this.getValue("description");
  }

  get is_active() {
    return this.getValue("description");
  }

  get created_at() {
    return this.getValue("description");
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }

  private getValue(prop: any) {
    const optional = ["unique_entity_id", "created_at"];
    const privateProp = `_${prop}`;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }
}
