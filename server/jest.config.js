module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text-summary"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"], // Match server.test.js
};
