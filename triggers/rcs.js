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
          'Sends the webhook only if the filter applies. For example, for different webhooks with different agents.',
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
        event_type: 'rcs',
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
      webhook_event: 'rcs',
      webhook_timestamp: '2024-03-08T09:47:12+01:00',
      data: {
        id: 1871353,
        sender: '4915153952979',
        time: 1709870553,
        message_type: 'RCS',
        content_type: 'text',
        text: 'Hallo',
        agent_id: 'myfancyagent',
      },
    },
    outputFields: [
      { key: 'webhook_event', label: 'Webhook Event' },
      { key: 'webhook_timestamp', label: 'Webhook Timestamp' },
      { key: 'data__id', label: 'ID' },
      { key: 'data__msg_id', label: 'Message ID' },
      { key: 'data__sender', label: 'Sender' },
      { key: 'data__time', label: 'Time' },
      { key: 'data__timestamp', label: 'Timestamp' },
      { key: 'data__message_type', label: 'Message Type' },
      { key: 'data__content_type', label: 'Content Type' },
      { key: 'data__status', label: 'Status' },
      { key: 'data__text', label: 'Text' },
      { key: 'data__agent_id', label: 'Agent ID' },
      { key: 'data__foreign_id', label: 'Foreign ID' },
      { key: 'data__suggestion_response__postbackData', label: 'Suggestion Postback Data' },
      { key: 'data__suggestion_response__text', label: 'Suggestion Text' },
      { key: 'data__suggestion_response__type', label: 'Suggestion Type' },
      { key: 'data__user_file__payload__fileUri', label: 'User File URI' },
      { key: 'data__user_file__payload__fileName', label: 'User File Name' },
      { key: 'data__user_file__payload__mimeType', label: 'User File MIME Type' },
      { key: 'data__user_file__payload__fileSizeBytes', label: 'User File Size (bytes)' },
      { key: 'data__user_file__thumbnail__fileUri', label: 'User File Thumbnail URI' },
      { key: 'data__location__latitude', label: 'Location Latitude' },
      { key: 'data__location__longitude', label: 'Location Longitude' },
    ],
  },
  key: 'rcs',
  noun: 'RCS',
  display: {
    label: 'Incoming RCS',
    description:
      'Triggers on any RCS-related event: inbound RCS messages (text, file, location, suggestion responses), delivery/read status updates, and IS_TYPING events. Use the Content Type / Status fields (or a Zapier filter) to react to the specific event you need.',
    directions:
      'Log into your service and paste the below URL into the webhook setup field.',
    hidden: false,
  },
};
