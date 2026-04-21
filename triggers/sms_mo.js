const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'event_filter',
        type: 'string',
        helpText:
          'Sends the webhook only if the filter applies. For example, for different webhooks with different inbound numbers.',
        label: 'Event Filter',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    type: 'hook',
    performSubscribe: {
      body: {
        target_url: '{{bundle.targetUrl}}',
        event_filter: '{{bundle.inputData.event_filter}}',
        request_method: 'JSON',
        event_type: 'sms_mo',
        action: 'subscribe',
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer {{bundle.authData.access_token}}',
      },
      method: 'POST',
      url: 'https://gateway.seven.io/api/hooks',
    },
    performUnsubscribe: {
      body: { id: '{{bundle.subscribeData.id}}', action: 'unsubscribe' },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer {{bundle.authData.access_token}}',
      },
      method: 'POST',
      url: 'https://gateway.seven.io/api/hooks',
    },
    performList: {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer {{bundle.authData.access_token}}',
      },
      params: { limit: '10', type: 'inbound' },
      url: 'https://gateway.seven.io/api/journal',
    },
    sample: {
      id: '681590',
      sender: 'SMS',
      system: '491771783130',
      text: 'Hello. I am an example for demonstrating a webhook payload.',
      time: '1605878104',
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'sender', label: 'Sender' },
      { key: 'system', label: 'System' },
      { key: 'text', label: 'Text' },
      { key: 'time', label: 'Time' },
    ],
  },
  key: 'SMS_MO',
  noun: 'SMS',
  display: {
    label: 'Incoming SMS',
    description: 'Triggers when a new inbound SMS has been received.',
    directions:
      'Log into your service and paste the below URL into the webhook setup field.',
    hidden: false,
  },
};
