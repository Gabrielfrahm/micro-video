import { Category } from "../../../category/domain/entities/category";
import { CategoryOutput } from "../dtos/category.dto";

export default class CategoryOutputMapper {
  static toOutPut(entity: Category): CategoryOutput {
    return entity.toJSON();
  }
}
