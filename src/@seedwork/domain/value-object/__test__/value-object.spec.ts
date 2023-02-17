import ValueObject from "../value-object";

class StubValueObject extends ValueObject {}

describe("Value object ", () => {
  it("Should set value ", () => {
    let vo = new StubValueObject("string value");
    expect(vo.value).toBe("string value");
    vo = new StubValueObject({ prop: "value 1" });
    expect(vo.value).toStrictEqual({ prop: "value 1" });
  });
});
