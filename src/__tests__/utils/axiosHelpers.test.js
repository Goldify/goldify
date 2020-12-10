import { basicHeaders } from "../../js/utils/axiosHelpers";

const goldifySolofixtures = require("../../__fixtures__/GoldifySolofixtures");
const axiosHeadersfixtures = require("../../__fixtures__/axiosHelpersfixtures");

test("basicHeaders returns a properly formatted header", async () => {
  const headers = basicHeaders(goldifySolofixtures.getTokensTestData());
  expect(headers).toEqual(axiosHeadersfixtures.basicHeaders());
});
