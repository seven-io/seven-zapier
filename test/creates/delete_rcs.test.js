const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('creates.delete_rcs', () => {
  it('should run', async () => {
    const bundle = { inputData: {} };

    const results = await appTester(
      App.creates['delete_rcs'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
  });
});
