const perform = async (z, bundle) => {
  const params = {
    type: bundle.inputData.type,
  };

  if (bundle.inputData.id) params.id = bundle.inputData.id;
  if (bundle.inputData.date_from) params.date_from = bundle.inputData.date_from;
  if (bundle.inputData.date_to) params.date_to = bundle.inputData.date_to;
  if (bundle.inputData.to) params.to = bundle.inputData.to;
  if (bundle.inputData.status) params.state = bundle.inputData.status;
  if (bundle.inputData.limit) params.limit = bundle.inputData.limit;

  const options = {
    url: 'https://gateway.seven.io/api/journal',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //'X-Api-Key': bundle.authData.access_token,
      SentWith: 'zapier',
    },
    params,
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  key: 'journal',
  noun: 'Journal',
  display: {
    label: 'Get Journal',
    description:
      'You can use this endpoint to query the last entries of your logbooks. Each query returns a maximum of 100 entries.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'type',
        label: 'Type',
        type: 'string',
        helpText: 'Type of logbook you want to query (Voice, SMS etc).',
        choices: ['outbound', 'voice', 'inbound', 'replies'],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'id',
        label: 'Message ID',
        type: 'integer',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'date_from',
        label: 'Date From',
        type: 'datetime',
        helpText: 'A Start date from which the search should start.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'date_to',
        label: 'Date To',
        type: 'datetime',
        helpText: 'An end date up to which the search is to be performed.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'to',
        label: 'Receiver',
        type: 'string',
        helpText: 'The receivers phone number in any format.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'status',
        label: 'Message status',
        type: 'string',
        helpText:
          'The status of the message. This could be e.g. completed / failed for Voice or DELIVERED / NOTDELIVERED etc. for SMS.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'integer',
        helpText:
          'Limits the numbers of entries to be returned. Must be an integer between 1-100.',
        default: '100',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      id: '77148389977',
      to: '4917661254799',
      from: 'xaxa',
      text: '',
      timestamp: '2021-08-03 12:51:09.019',
      price: '0.0000',
      dlr: null,
      dlr_timestamp: null,
      mccmnc: null,
      latency: null,
      type: 'direct',
      connection: 'http',
      label: null,
      foreign_id: null,
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'to', label: 'Recipient' },
      { key: 'from', label: 'Sender' },
      { key: 'text', label: 'Text' },
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'price', label: 'Price' },
      { key: 'dlr', label: 'DLR' },
      { key: 'dlr_timestamp', label: 'DLR Timestamp' },
      { key: 'mccmnc', label: 'MCC / MNC' },
      { key: 'latency', label: 'Latency' },
      { key: 'type', label: 'Type' },
      { key: 'connection', label: 'Connection' },
      { key: 'label', label: 'Label' },
      { key: 'foreign_id', label: 'Foreign ID' },
    ],
    perform: perform,
  },
};
