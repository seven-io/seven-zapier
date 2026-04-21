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
      type: 'format',
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
  key: 'number_format',
  noun: 'Number Format',
  display: {
    label: 'Lookup Number Format',
    description:
      'Query the national and international format of any mobile phone number. In addition, you will receive the corresponding network operator for the phone number as information (without porting information).',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'number',
        label: 'Number',
        type: 'string',
        helpText:
          'The number to be queried. The format is almost arbitrary – our gateway automatically formats the number correctly.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: true,
      national: '0171 6992343',
      international: '+491716992343',
      international_formatted: '+49 171 6992343',
      country_name: 'Germany',
      country_code: '49',
      country_iso: 'DE',
      carrier: 'T-Mobile',
      network_type: 'mobile',
    },
    outputFields: [
      { key: 'success', label: 'Success', type: 'boolean' },
      { key: 'national', label: 'National' },
      { key: 'international', label: 'International' },
      { key: 'international_formatted', label: 'International Formatted' },
      { key: 'country_name', label: 'Country Name' },
      { key: 'country_code', label: 'Country Code' },
      { key: 'country_iso', label: 'Country Code ISO 3166-1 alpha-2' },
      { key: 'carrier', label: 'Carrier' },
      { key: 'network_type', label: 'Network Type' },
    ],
    perform: perform,
  },
};
