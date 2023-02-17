import { deepFreeze } from "./objects";

describe("object Unit Teste", () => {
  it("should not freeze a scalar value", () => {
    let arrange = [
      { received: "a", expected: "string" },
      { received: true, expected: "boolean" },
      { received: false, expected: "boolean" },
      { received: 5, expected: "number" },
    ];
    arrange.forEach((element) => {
      const str = deepFreeze(element.received);
      expect(typeof str).toBe(element.expected);
    });
  });

  it("should be a immutable object", () => {
    const obj = deepFreeze({
      prop1: "value 1",
      deep: { props2: "value 2", prop3: new Date() },
    });

    expect(() => {
      (obj as any).prop1 = "aaaaaaaa";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );
  });
});
