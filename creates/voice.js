const perform = async (z, bundle) => {
  const options = {
    url: 'https://gateway.seven.io/api/voice',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //'X-API-KEY': bundle.authData.api_key,
      SentWith: 'zapier',
    },
    body: {
      text: bundle.inputData.text,
      from: bundle.inputData.from,
      to: bundle.inputData.to,
      xml: Number(Boolean(bundle.inputData.xml)),
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
  key: 'voice',
  noun: 'Voice',
  display: {
    label: 'Send Voice',
    description:
      'Converts text to speech, calls the given number and reads it loud.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'text',
        label: 'Text',
        type: 'string',
        helpText:
          'The message content to read loud. No more than 10.000 characters.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'from',
        label: 'From',
        type: 'string',
        helpText:
          'The Caller ID. Please use only verified sender IDs, one of your virtual inbound numbers or one of our shared virtual numbers.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'to',
        label: 'To',
        type: 'string',
        helpText: 'The recipient number to call. Only one recipient per call.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'xml',
        label: 'XML',
        type: 'boolean',
        helpText: 'Check this box if the text is in XML format.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: '100',
      total_price: 0,
      balance: 14.903,
      debug: true,
      messages: [
        {
          id: '123456789',
          sender: '491771783130',
          recipient: '491716992343',
          text: 'Hi friend!',
          price: 0,
          success: true,
          error: null,
          error_text: null,
        },
      ],
    },
    outputFields: [
      { key: 'success', label: 'Success' },
      { key: 'total_price', type: 'number', label: 'Total Price' },
      { key: 'balance', type: 'number', label: 'Balance' },
      { key: 'debug', type: 'boolean', label: 'Debug' },
      { key: 'messages[]id', label: 'Message ID' },
      { key: 'messages[]sender', label: 'Message Sender' },
      { key: 'messages[]recipient', label: 'Message Recipient' },
      { key: 'messages[]text', label: 'Message Text' },
      { key: 'messages[]price', type: 'number', label: 'Message Price' },
      { key: 'messages[]success', type: 'boolean', label: 'Message Success' },
      { key: 'messages[]error', label: 'Message Error' },
      { key: 'messages[]error_text', label: 'Message Error Text' },
    ],
    perform: perform,
  },
};
