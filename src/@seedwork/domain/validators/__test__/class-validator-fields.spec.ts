import ClassValidatorFields from "../class-validator-fields";
import * as libClassValidator from "class-validator";

class StubValidatorFields extends ClassValidatorFields<{ field: string }> {}

describe("Class validator fields unit test", () => {
  it("should initialize erros and validatedData variables with null", () => {
    const validator = new StubValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("Should validate with errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([
      { property: "field", constraints: { isRequired: "some error" } },
    ]);
    const validator = new StubValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({ field: ["some error"] });
  });
  it("Should validate without errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([]);
    const validator = new StubValidatorFields();
    expect(validator.validate({ field: "value" })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBe({ field: "value" });
    expect(validator.errors).toBeNull();
  });
});
