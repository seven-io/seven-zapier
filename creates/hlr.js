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
      type: 'hlr',
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
  key: 'hlr',
  noun: 'HLR',
  display: {
    label: 'Lookup HLR',
    description:
      'Looks up information regarding home location register for a given phone number.',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'number',
        label: 'Number',
        type: 'string',
        helpText:
          'The number to query. The format is almost arbitrary – our gateway automatically formats the number correctly.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      status: true,
      status_message: 'success',
      lookup_outcome: true,
      lookup_outcome_message: 'success',
      international_format_number: '491716992343',
      international_formatted: '+49 171 6992343',
      national_format_number: '0171 6992343',
      country_code: 'DE',
      country_name: 'Germany',
      country_prefix: '49',
      current_carrier: {
        network_code: '26201',
        name: 'Telekom Deutschland GmbH (Telekom)',
        country: 'DE',
        network_type: 'mobile',
      },
      original_carrier: {
        network_code: '26201',
        name: 'Telekom Deutschland GmbH (Telekom)',
        country: 'DE',
        network_type: 'mobile',
      },
      valid_number: 'valid',
      reachable: 'unknown',
      ported: 'assumed_not_ported',
      roaming: 'not_roaming',
      gsm_code: null,
      gsm_message: null,
    },
    outputFields: [
      { key: 'status', label: 'Status', type: 'boolean' },
      { key: 'status_message', label: 'Status Message' },
      { key: 'lookup_outcome', label: 'Lookup Outcome', type: 'boolean' },
      { key: 'lookup_outcome_message', label: 'Lookup Outcome Message' },
      {
        key: 'international_format_number',
        label: 'International Format Number',
      },
      { key: 'international_formatted', label: 'International Formatted' },
      { key: 'national_format_number', label: 'National Format Number' },
      { key: 'country_code', label: 'Country Code' },
      { key: 'country_name', label: 'Country Name' },
      { key: 'country_prefix', label: 'Country Prefix' },
      {
        key: 'current_carrier__network_code',
        label: 'Current Carrier Network Code',
      },
      { key: 'current_carrier__name', label: 'Current Carrier Name' },
      { key: 'current_carrier__country', label: 'Current Carrier Country' },
      {
        key: 'current_carrier__network_type',
        label: 'Current Carrier Network Type',
      },
      {
        key: 'original_carrier__network_code',
        label: 'Original Carrier Network Code',
      },
      { key: 'original_carrier__name', label: 'Original Carrier Name' },
      { key: 'original_carrier__country', label: 'Original Carrier Country' },
      {
        key: 'original_carrier__network_type',
        label: 'Original Carrier Network Type',
      },
      { key: 'valid_number', label: 'Valid Number' },
      { key: 'reachable', label: 'Reachable' },
      { key: 'ported', label: 'Ported' },
      { key: 'roaming', label: 'Roaming' },
      { key: 'gsm_code', label: 'GSM Code' },
      { key: 'gsm_message', label: 'GSM Message' },
    ],
    perform: perform,
  },
};
