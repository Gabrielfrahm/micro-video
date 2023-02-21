import ValidatorError from "../../errors/validator.error";
import ValidatorRules from "../validator-rules";

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

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  // @ts-ignore
  method.apply(validator, params);
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

    arrange = [
      { value: "test", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

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

    arrange = [
      { value: "test", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

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

  test("boolean validator rule", () => {
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: "true", property: "field" },
      { value: "false", property: "field" },
    ];

    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error: new ValidatorError("The field must be a boolean"),
      });
    });

    arrange = [
      { value: true, property: "field" },
      { value: false, property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error: new ValidatorError("The field must be a boolean"),
      });
    });
  });

  test("should throw a validation error when combine two or more validation rule", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().string()).toThrow(
      "The field is required"
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().string()).toThrow(
      "The field must be a string"
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      "The field must be a string"
    );

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      "The field must less or equal than 5 characters"
    );

    validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().boolean()).toThrow(
      "The field is required"
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().boolean()).toThrow(
      "The field must be a boolean"
    );
  });

  test("should valid when combine two or more validation rules", () => {
    expect.assertions(0);
    ValidatorRules.values("test", "field").required().string();
    ValidatorRules.values("test", "field").required().string().maxLength(4);

    ValidatorRules.values(true, "field").required().boolean();
    ValidatorRules.values(false, "field").required().boolean();
  });
});
