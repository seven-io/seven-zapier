const perform = async (z, bundle) => {
  const options = {
    url: 'https://gateway.seven.io/api/hooks',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //'X-API-KEY': bundle.authData.api_key,
      SentWith: 'zapier',
    },
    body: {
      action: 'subscribe',
      target_url: bundle.inputData.target_url,
      event_type: bundle.inputData.event_type,
      event_filter: bundle.inputData.event_filter,
      request_method: bundle.inputData.request_method,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  key: 'register_webhook',
  noun: 'Webhook',
  display: {
    label: 'Register Webhook',
    description: 'Registers a Webhook.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'target_url',
        label: 'Target URL',
        type: 'string',
        helpText: 'Target URL of your Webhook.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'event_type',
        label: 'Event Type',
        type: 'string',
        helpText:
          'Type of event for which you would like to receive a webhook.',
        choices: [
          { sample: 'all', value: 'all', label: 'All' },
          { sample: 'sms_mo', value: 'sms_mo', label: 'Inbound SMS' },
          { sample: 'dlr', value: 'dlr', label: 'SMS status seport' },
          {
            sample: 'voice_status',
            value: 'voice_status',
            label: 'Voice call status',
          },
          {
            sample: 'voice_call',
            value: 'voice_call',
            label: 'Voice call info',
          },
          {
            sample: 'tracking',
            value: 'tracking',
            label: 'Performance tracking clicks/views',
          },
        ],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'event_filter',
        label: 'Event Filter',
        type: 'string',
        helpText:
          'Sends the webhook only if the filter applies. For example, for different webhooks with different inbound numbers.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'request_method',
        label: 'Request Method',
        type: 'string',
        helpText: 'Request method in which you want to receive the webhook.',
        choices: ['POST', 'GET', 'JSON'],
        default: 'POST',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: { success: true, code: null, id: 970 },
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'id', type: 'integer', label: 'Webhook ID' },
    ],
    perform: perform,
  },
};
