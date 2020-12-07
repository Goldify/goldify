import { basicHeaders } from "../../js/utils/axiosHelpers";

const goldifyExecuteTestUtils = require("../../__test_utils__/GoldifyExecuteTestUtils");
const axiosHeadersTestUtils = require("../../__test_utils__/axiosHelpersTestUtils");

test("basicHeaders returns a properly formatted header", async () => {
  const headers = basicHeaders(goldifyExecuteTestUtils.getTokensTestData());
  expect(headers).toEqual(axiosHeadersTestUtils.basicHeaders());
});
