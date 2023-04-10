import {
  CategoryOutput,
  ListCategoriesUseCase,
} from 'core/category/application';
import { Exclude, Expose, Transform } from 'class-transformer';
import { CollectionPresenter } from '../../@share/presenters/collection.presenter';
export class CategoryPresenter {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  @Exclude()
  protected _data: CategoryPresenter[];

  constructor(output: ListCategoriesUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this._data = items.map((item) => new CategoryPresenter(item));
  }

  @Expose({ name: 'data' })
  get data() {
    return this._data;
  }
}
