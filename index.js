const authentication = require('./authentication');
const smsMoTrigger = require('./triggers/sms_mo.js');
const voiceCallTrigger = require('./triggers/voice_call.js');
const voiceCreate = require('./creates/voice.js');
const hlrCreate = require('./creates/hlr.js');
const mnpCreate = require('./creates/mnp.js');
const cnamCreate = require('./creates/cnam.js');
const numberFormatCreate = require('./creates/number_format.js');
const registerWebhookCreate = require('./creates/register_webhook.js');
const sendSmsCreate = require('./creates/send_sms.js');
const analyticsSearch = require('./searches/analytics.js');
const journalSearch = require('./searches/journal.js');
const hydrators = require('./hydrators');

const fs = require('fs');
const scriptingSource = fs.readFileSync('./scripting.js', { encoding: 'utf8' });

module.exports = {
  triggers: {
    [smsMoTrigger.key]: smsMoTrigger,
    [voiceCallTrigger.key]: voiceCallTrigger,
  },
  creates: {
    [voiceCreate.key]: voiceCreate,
    [hlrCreate.key]: hlrCreate,
    [mnpCreate.key]: mnpCreate,
    [cnamCreate.key]: cnamCreate,
    [numberFormatCreate.key]: numberFormatCreate,
    [registerWebhookCreate.key]: registerWebhookCreate,
    [sendSmsCreate.key]: sendSmsCreate,
  },
  searches: {
    [analyticsSearch.key]: analyticsSearch,
    [journalSearch.key]: journalSearch,
  },
  hydrators: hydrators,
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  legacy: {
    subscribeUrl:
      'https://gateway.seven.io/api/hooks?action=subscribe&request_method=JSON&sendwith=zapier',
    unsubscribeUrl:
      'https://gateway.seven.io/api/hooks?action=unsubscribe&request_method=JSON&sendwith=zapier',
    triggers: {},
    creates: {},
    searches: {},
    scriptingSource: scriptingSource,
    loadCustomFieldsEarly: false,
    needsFlattenedData: false,
    needsTriggerData: false,
  },
  authentication: authentication,
  flags: { skipThrowForStatus: true },
};
