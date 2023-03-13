import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { CategoryProperties } from "../entities/category";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  constructor(data: CategoryProperties) {
    Object.assign(this, data);
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(data: CategoryRules): boolean {
    return super.validate(new CategoryRules(data ?? ({} as any)));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}

export default CategoryValidatorFactory;
