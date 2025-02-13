/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      useESM: true
    }],
  },
};