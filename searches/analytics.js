const perform = async (z, bundle) => {
  const params = {};
  if (bundle.inputData.start) params.start = bundle.inputData.start;
  if (bundle.inputData.end) params.end = bundle.inputData.end;
  if (bundle.inputData.label) params.label = bundle.inputData.label;
  if (bundle.inputData.subaccounts)
    params.subaccounts = bundle.inputData.subaccounts;
  if (bundle.inputData.group_by) params.group_by = bundle.inputData.group_by;

  const options = {
    url: 'https://gateway.seven.io/api/analytics',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //'X-API-KEY': bundle.authData.api_key,
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
  key: 'analytics',
  noun: 'Analytics',
  display: {
    label: 'Get Analytics',
    description:
      'Get detailed statistics of your account directly through our API.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'group_by',
        label: 'Group By',
        type: 'string',
        helpText: 'Defines the grouping of the data.',
        choices: ['date', 'label', 'subaccount', 'country'],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'start',
        label: 'Start Date',
        type: 'datetime',
        helpText:
          'Start date of the statistics in the format YYYY-MM-DD. By default, the date of 30 days ago is set.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'end',
        label: 'End Date',
        type: 'datetime',
        helpText: 'End date of the statistics. By default, the current day.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'label',
        label: 'Label',
        type: 'string',
        helpText: 'Shows only data of a specific label.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'subaccounts',
        label: 'Subaccounts',
        type: 'string',
        helpText:
          'Receive the data only for the main account, all your (sub-)accounts or only for specific subaccounts.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      date: '2021-07-06',
      sms: 0,
      voice: 0,
      hlr: 1,
      mnp: 0,
      inbound: 0,
      usage_eur: 0.01,
    },
    outputFields: [
      { key: 'date', label: 'Date' },
      { key: 'sms', label: 'SMS', type: 'integer' },
      { key: 'voice', label: 'Voice', type: 'integer' },
      { key: 'hlr', label: 'HLR', type: 'integer' },
      { key: 'mnp', label: 'MNP', type: 'integer' },
      { key: 'inbound', label: 'Inbound', type: 'integer' },
      { key: 'usage_eur', label: 'Usage EUR', type: 'number' },
    ],
    perform: perform,
  },
};
