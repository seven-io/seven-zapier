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
      json: Number(Boolean(bundle.inputData.json)),
      type: 'mnp',
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
  key: 'MNP',
  noun: 'MNP',
  display: {
    label: 'Lookup MNP',
    description:
      'Looks up information regarding mobile number portability for a given phone number.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'number',
        label: 'Number',
        type: 'string',
        helpText: 'The mobile phone number to look up information for.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'json',
        label: 'JSON',
        type: 'boolean',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: true,
      code: 100,
      price: 0.005,
      mnp: {
        country: 'DE',
        number: '+491716992343',
        national_format: '0171 6992343',
        international_formatted: '+49 171 6992343',
        network: 'Telekom Deutschland GmbH (Telekom)',
        mccmnc: '26201',
        isPorted: false,
      },
    },
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'code', label: 'Code', type: 'integer' },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'mnp__country', label: 'Country' },
      { key: 'mnp__number', label: 'Number' },
      { key: 'mnp__national_format', label: 'National Format' },
      { key: 'mnp__international_formatted', label: 'International Formatted' },
      { key: 'mnp__network', label: 'Network' },
      { key: 'mnp__mccmnc', label: 'MCC MNC' },
      { key: 'mnp__isPorted', label: 'Is Ported?', type: 'boolean' },
    ],
    perform: perform,
  },
};
