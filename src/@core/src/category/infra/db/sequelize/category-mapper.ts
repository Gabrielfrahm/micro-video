import { Category } from "#category/domain";
import { EntityValidationError, LoadEntityError } from "#seedwork/domain";
import UniqueEntityId from "#seedwork/domain/value-object/unique-entity-id.vo";
import { CategoryModel } from "./category-model";

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    const { id, ...rest } = model.toJSON();
    try {
      return new Category(rest, new UniqueEntityId(id));
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }
      throw e;
    }
  }
}
