import { Category } from "../../../domain/entities/category";
import CategoryRepository from "../../../domain/repository/category.repository";
import { InMemorySearchableRepository } from "../../../../@seedwork/domain/repository/in-memory.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ["name", "created_at"];
  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return item.props.name
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase());
    });
  }

  protected async applySort(
    items: Category[],
    sort: string | null,
    sort_dir: string | null
  ): Promise<Category[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }
    return super.applySort(items, sort, sort_dir);
  }
}

export default CategoryInMemoryRepository;
