import ValidatorError from "../../@seedwork/errors/validator.error";
import ValidatorRules from "./validator-rules";

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  error: ValidatorError;
  rule: keyof ValidatorRules;
  params?: any[];
};

function assertIsInvalid({
  value,
  property,
  rule,
  error,
  params = [],
}: ExpectedRule) {
  expect(() => {
    const validator = ValidatorRules.values(value, property);
    const method = validator[rule];
    // @ts-ignore
    method.apply(validator, params);
  }).toThrow(error);
}

function assertIsValid({
  value,
  property,
  rule,
  error,
  params = [],
}: ExpectedRule) {
  expect(() => {
    const validator = ValidatorRules.values(value, property);
    const method = validator[rule];
    // @ts-ignore
    method.apply(validator, params);
  }).not.toThrow(error);
}

describe("Validator rules Unit Test", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("require validator rule", () => {
    let arrange: Values[] = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "", property: "field" },
    ];

    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidatorError("The field is required"),
      });
    });

    arrange = [
      { value: "test", property: "field" },
      { value: 0, property: "field" },
      { value: true, property: "field" },
    ];

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidatorError("The field is required"),
      });
    });
  });

  test("string validator rule", () => {
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: false, property: "field" },
    ];

    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error: new ValidatorError("The field must be a string"),
      });
    });

    arrange = [{ value: "test", property: "field" }];

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
        error: new ValidatorError("The field must be a string"),
      });
    });
  });

  test("maxLength validator rule", () => {
    let arrange: Values[] = [{ value: "aaaaaa", property: "field" }];

    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error: new ValidatorError(
          "The field must less or equal than 5 characters"
        ),
        params: [5],
      });
    });

    arrange = [{ value: "test", property: "field" }];

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error: new ValidatorError(
          "The field must less or equal than 5 characters"
        ),
        params: [4],
      });
    });
  });
});
