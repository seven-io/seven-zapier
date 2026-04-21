const perform = async (z, bundle) => {
  const options = {
    url: 'https://gateway.seven.io/api/sms',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //'X-API-KEY': bundle.authData.api_key,
      SentWith: 'zapier',
    },
    body: {
      from: bundle.inputData.from,
      to: bundle.inputData.to,
      text: bundle.inputData.text,
      flash: Number(Boolean(bundle.inputData.flash)),
      label: bundle.inputData.label,
      delay: bundle.inputData.delay,
      no_reload: Number(Boolean(bundle.inputData.no_reload)),
      ttl: bundle.inputData.ttl,
      performance_tracking: Number(
        Boolean(bundle.inputData.performance_tracking),
      ),
      foreign_id: bundle.inputData.foreign_id,
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
  key: 'send_sms',
  noun: 'Sms',
  display: {
    description: 'Send a SMS to one or more specific number(s). ',
    hidden: false,
    label: 'Send SMS',
  },
  operation: {
    inputFields: [
      {
        key: 'from',
        label: 'Sender ID',
        type: 'string',
        helpText:
          'The sender ID of your SMS. This could be any valid MSISDN number or a alphanumeric sender id with up to 11 characters (no special chars allowed).\n\nExamples:\n49176123456789\nAcmeCorp.\n\nIf nothing specified, the default value of your account will be used.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'to',
        label: 'Recipient(s)',
        type: 'string',
        helpText:
          'One or more recipient numbers for the SMS.\n\nThis could be any valid MSIDN in several formats.\n\nExamples:\n49176xxxxxxx\n+49176xxxxxxx\n0049176xxxxxxx.',
        required: true,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: 'text',
        label: 'Text',
        type: 'text',
        helpText:
          'The text message content. Max not exceed 1520 characters, which equals 10 SMS.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'flash',
        label: 'Flash SMS',
        type: 'boolean',
        helpText:
          'Send a flash SMS. This kind of SMS will be immediately displayed and not been saved on the handset.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'label',
        label: 'Label',
        type: 'text',
        helpText:
          'You can optionally set a separate label for each SMS so that you can assign it to your statistics. Max. 100 chars, allowed characters: a-z, A-Z, 0-9, .-_@.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'delay',
        label: 'Delay',
        type: 'datetime',
        helpText:
          'Specify a custom point of time for time-delayed SMS. Accepts a Unix timestamp or a date/time string formatted as yyyy-mm-dd hh:ii.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'no_reload',
        label: 'No Reloadlock',
        type: 'boolean',
        helpText:
          'Switch off reload lock. This lock prevents the sending of the same SMS (text, type and recipient alike) within 180 seconds. You can deactivate this lock permanently in your login under Settings > SMS.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'ttl',
        label: 'Time To Live',
        type: 'integer',
        helpText: 'Specifies the validity period of the SMS in minutes.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'performance_tracking',
        label: 'Performance Tracking',
        type: 'boolean',
        helpText:
          'Enable Performance Tracking for URLs found in the message text.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'foreign_id',
        label: 'Foreign ID',
        type: 'text',
        helpText:
          'Provide your own data for this message. You will get the foreign_id returned in DLR callbacks etc. Max. 64 chars, allowed characters: a-z, A-Z, 0-9, .-_@.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'get_replies',
        label: 'Get Replies',
        type: 'boolean',
        helpText:
          'Enable, if you want to receive replies - [learn more](https://help.seven.io/en/shared-numbers).',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: '100',
      total_price: 0,
      balance: 14.805,
      debug: 'true',
      sms_type: 'direct',
      messages: [
        {
          id: null,
          sender: 'Zapier',
          recipient: '491771783130',
          text: 'HI2U!',
          encoding: 'gsm',
          label: 'MyLabel',
          parts: 1,
          price: 0,
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
      { key: 'messages[]price', label: 'Message Price' },
      { key: 'messages[]success', label: 'Message Success', type: 'boolean' },
      { key: 'messages[]error', label: 'Message Error' },
      { key: 'messages[]error_text', label: 'Message Error Text' },
    ],
    perform: perform,
  },
};
