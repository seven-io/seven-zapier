const perform = async (z, bundle) => {
  const options = {
    url:
      'https://gateway.seven.io/api/rcs/messages/' +
      encodeURIComponent(bundle.inputData.msg_id),
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.access_token,
      Accept: 'application/json',
      SentWith: 'zapier',
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    return response.json;
  });
};

module.exports = {
  key: 'delete_rcs',
  noun: 'RCS',
  display: {
    description:
      'Revoke (delete) an RCS message that has not been delivered yet. Only possible if the handset supports the REVOCATION capability, and only if no SMS/Rich SMS fallback was set.',
    hidden: false,
    label: 'Delete RCS',
  },
  operation: {
    inputFields: [
      {
        key: 'msg_id',
        label: 'Message ID',
        type: 'string',
        helpText:
          'The ID of the RCS message to revoke (from the Send RCS response).',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      success: true,
    },
    outputFields: [{ key: 'success', label: 'Success', type: 'boolean' }],
    perform: perform,
  },
};
