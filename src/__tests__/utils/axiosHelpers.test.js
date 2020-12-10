import { basicHeaders } from "../../js/utils/axiosHelpers";

const goldifySoloFixtures = require("../../__fixtures__/GoldifySoloFixtures");
const axiosHeadersFixtures = require("../../__fixtures__/axiosHelpersFixtures");

test("basicHeaders returns a properly formatted header", async () => {
  const headers = basicHeaders(goldifySoloFixtures.getTokensTestData());
  expect(headers).toEqual(axiosHeadersFixtures.basicHeaders());
});
