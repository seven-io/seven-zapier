// Parses a string input that may either be a plain value or a JSON-encoded
// object/array. RCS accepts both (e.g. text can be a raw string for a simple
// message, or a JSON object containing richcard/carousel/suggestions). We
// opportunistically parse anything that looks like JSON so users don't need
// separate inputs for the two modes.
const maybeParseJson = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const first = trimmed[0];
  if (first !== '{' && first !== '[') return value;
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    return value;
  }
};

const perform = async (z, bundle) => {
  const body = {
    from: bundle.inputData.from,
    to: bundle.inputData.to,
    text: maybeParseJson(bundle.inputData.text),
    label: bundle.inputData.label,
    delay: bundle.inputData.delay,
    ttl: bundle.inputData.ttl,
    performance_tracking: bundle.inputData.performance_tracking
      ? Number(Boolean(bundle.inputData.performance_tracking))
      : undefined,
    foreign_id: bundle.inputData.foreign_id,
    fallback: maybeParseJson(bundle.inputData.fallback),
  };

  Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

  const options = {
    url: 'https://gateway.seven.io/api/rcs/messages',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      SentWith: 'zapier',
    },
    body: body,
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    return response.json;
  });
};

module.exports = {
  key: 'send_rcs',
  noun: 'RCS',
  display: {
    description:
      'Send an RCS message (plain text or rich content like richcards, carousels, suggestions).',
    hidden: false,
    label: 'Send RCS',
  },
  operation: {
    inputFields: [
      {
        key: 'from',
        label: 'Agent ID',
        type: 'string',
        helpText:
          'The unique ID of your RCS agent. Find it under Settings → Caller IDs. If omitted, the first RCS-capable sender on your account is used.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'to',
        label: 'Recipient',
        type: 'string',
        helpText:
          'Recipient phone number (MSISDN), contact name or group name. Examples: 49176xxxxxxx, +49176xxxxxxx.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'text',
        label: 'Text or RCS Content (JSON)',
        type: 'text',
        helpText:
          'For a plain text RCS message, enter the text directly. For rich content (richcard, carousel, file, suggestions), paste a JSON object. See the [RCS Content schema](https://docs.seven.io/rest-api/objects/rcs-content) for the full structure.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'fallback',
        label: 'Fallback',
        type: 'string',
        helpText:
          'Optional fallback channel when RCS delivery is not possible (e.g. the handset does not support RCS).\n\nSimple form: `sms` or `webview`.\n\nAdvanced form: a JSON object, e.g. `{"type":"sms","text":"Fallback text","from":"Sender"}`.\n\nLeave empty to disable fallback. Note: if fallback is set, the RCS message cannot be revoked (deleted) later.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'delay',
        label: 'Delay',
        type: 'datetime',
        helpText:
          'Schedule the RCS for a future point in time. Accepts a Unix timestamp or yyyy-mm-dd hh:ii.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'ttl',
        label: 'Time To Live (minutes)',
        type: 'integer',
        helpText:
          'Validity period of the RCS in minutes. Default is 2880 (48 hours).',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'label',
        label: 'Label',
        type: 'string',
        helpText:
          'Optional label for assigning the RCS to your statistics. Max. 100 chars, allowed: a-z, A-Z, 0-9, .-_@.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'performance_tracking',
        label: 'Performance Tracking',
        type: 'boolean',
        helpText:
          'Enable click/performance tracking for URLs found in the RCS text. Also enables URL shortening.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'foreign_id',
        label: 'Foreign ID',
        type: 'string',
        helpText:
          'Your own ID for this message. Returned in status callbacks. Max. 64 chars, allowed: a-z, A-Z, 0-9, .-_@.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: '100',
      total_price: null,
      balance: 3218.988,
      debug: 'false',
      sms_type: 'direct',
      messages: [
        {
          id: '77233319353',
          sender: 'myfancyagent',
          recipient: '49176123456789',
          text: 'Hello World!',
          encoding: 'gsm',
          label: null,
          parts: 0,
          udh: null,
          is_binary: false,
          price: 0,
          channel: 'RCS',
          success: true,
          error: null,
          error_text: null,
        },
      ],
    },
    outputFields: [
      { key: 'success', label: 'Success' },
      { key: 'total_price', label: 'Total Price', type: 'number' },
      { key: 'balance', label: 'Balance', type: 'number' },
      { key: 'debug', label: 'Debug' },
      { key: 'sms_type', label: 'SMS Type' },
      { key: 'messages[]id', label: 'Message ID' },
      { key: 'messages[]sender', label: 'Message Sender' },
      { key: 'messages[]recipient', label: 'Message Recipient' },
      { key: 'messages[]text', label: 'Message Text' },
      { key: 'messages[]encoding', label: 'Message Encoding' },
      { key: 'messages[]label', label: 'Message Label' },
      { key: 'messages[]parts', label: 'Message Parts' },
      { key: 'messages[]price', label: 'Message Price', type: 'number' },
      { key: 'messages[]channel', label: 'Channel' },
      { key: 'messages[]success', label: 'Message Success', type: 'boolean' },
      { key: 'messages[]error', label: 'Message Error' },
      { key: 'messages[]error_text', label: 'Message Error Text' },
    ],
    perform: perform,
  },
};
