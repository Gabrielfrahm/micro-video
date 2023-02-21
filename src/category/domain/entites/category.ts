import Entity from "../../../@seedwork/domain/entity/entity";
import UniqueEntityId from "../../../@seedwork/domain/value-object/unique-entity-id.vo";
import CategoryValidatorFactory from "../validator/category.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validator.error";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export type UpdateCategory = {
  name?: string;
  description?: string;
};

export class Category extends Entity<CategoryProperties> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    super(props, id);
    this.props.description = this.description ?? null;
    this.props.is_active = this.is_active ?? true;
    this.props.created_at = this.created_at ?? new Date();
  }

  update({ name, description }: UpdateCategory): void {
    Category.validate({
      name: name,
      description: description,
    });
    this.props.name = name;
    this.props.description = description;
  }

  // static validate(props: Omit<CategoryProperties, "created_at">) {
  //   ValidatorRules.values(props.name, "name")
  //     .required()
  //     .string()
  //     .maxLength(255);
  //   ValidatorRules.values(props.description, "description").string();
  //   ValidatorRules.values(props.is_active, "is_active").boolean();
  // }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at(): Date {
    return this.props.created_at;
  }
}
