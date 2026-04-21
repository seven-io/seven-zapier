const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('creates.send_rcs_event', () => {
  it('should run', async () => {
    const bundle = { inputData: {} };

    const results = await appTester(
      App.creates['send_rcs_event'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
  });
});
