module.exports = {
	testEnvironment: 'node',
	preset: '@shelf/jest-mongodb',
  },
{
	"collectCoverage": true,
	"coverageReporters": ["lcov"],
	"coverageDirectory": "test-coverage",
	"coverageThreshold": {
	"global": {
		"branches": 0,
		"functions": 0,
		"lines": 0,
		"statements": 0
	}
 },
}