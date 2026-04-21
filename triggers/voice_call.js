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
    performUnsubscribe: {
      body: { id: '{{bundle.subscribeData.id}}' },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer {{bundle.authData.access_token}}',
      },
      method: 'POST',
      url: 'https://gateway.seven.io/api/hooks',
    },
    performSubscribe: {
      body: {
        target_url: '{{bundle.targetUrl}}',
        event_filter: '{{bundle.inputData.event_filter}}',
        request_method: 'JSON',
        event_type: 'voice_call',
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
    performList: {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer {{bundle.authData.access_token}}',
      },
      params: { type: 'voice_call', sendwith: 'zapier', json: '1' },
      url: 'https://gateway.seven.io/api/journal',
    },
    sample: {
      id: 2,
      caller: '4943160049851',
      time: 1614961009,
      system: '491716958038',
    },
    outputFields: [
      { key: 'id', label: 'ID', type: 'integer' },
      { key: 'caller', label: 'Caller' },
      { key: 'time', label: 'Time', type: 'integer' },
      { key: 'system', label: 'System' },
    ],
  },
  display: {
    description: 'Triggers when somebody calls you.',
    directions:
      'Log into your service and paste the below URL into the webhook setup field.',
    hidden: false,
    label: 'Incoming Call',
  },
  key: 'VOICE_CALL',
  noun: 'Call',
};
