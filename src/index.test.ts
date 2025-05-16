import { describe, it, expect, test, beforeEach, spyOn } from "bun:test";
import main from "./index";
import pkg from "../package.json";

// Helper to capture console.log output
let output = "";

beforeEach(() => {
  output = "";
  spyOn(console, "log").mockImplementation((msg: any) => {
    output += msg;
  });
});

describe("main export", () => {
  it("logs the expected intro and version", () => {
    main();
    expect(output).toContain(`Dave Williams (v${pkg.version})`);
    expect(output).toContain("https://"); // At least one URL
  });
});