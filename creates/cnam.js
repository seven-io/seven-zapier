const perform = async (z, bundle) => {
  const options = {
    url: 'https://gateway.seven.io/api/lookup',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //'X-API-KEY': bundle.authData.api_key,
      SentWith: 'zapier',
    },
    body: {
      number: bundle.inputData.number,
      type: 'cnam',
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
  key: 'CNAM',
  noun: 'Cnam',
  display: {
    label: 'Lookup CNAM',
    description:
      'Query the Caller ID name for any phone number worldwide. Please note that not every phone number has an entry. Since the data is collected from various sources you could get geographical locations, company names/names or the network operator in response.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'number',
        label: 'Number',
        type: 'string',
        helpText: 'The mobile phone number to look up.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: 'true',
      code: '100',
      number: '+491716992343',
      name: 'GERMANY',
    },
    outputFields: [
      { key: 'success', label: 'Success' },
      { key: 'code', label: 'Code' },
      { key: 'number', label: 'Number' },
      { key: 'name', label: 'Name' },
    ],
    perform: perform,
  },
};
