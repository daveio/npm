import assert from "node:assert/strict";
import test from "node:test";
import dave from "../src/index.js";

test("Status", (t) => {
  assert.ok(true);
});

test("Output", (t) => {
  dave();
  assert.ok(true);
});
