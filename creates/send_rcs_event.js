const perform = async (z, bundle) => {
  const body = {
    to: bundle.inputData.to,
    event: bundle.inputData.event,
    from: bundle.inputData.from,
    msg_id: bundle.inputData.msg_id,
  };

  Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

  const options = {
    url: 'https://gateway.seven.io/api/rcs/events',
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
  key: 'send_rcs_event',
  noun: 'RCS Event',
  display: {
    description:
      'Send an RCS event (IS_TYPING or READ) to provide a more authentic conversational experience. Typically sent shortly after receiving an inbound RCS.',
    hidden: false,
    label: 'Send RCS Event',
  },
  operation: {
    inputFields: [
      {
        key: 'to',
        label: 'Recipient',
        type: 'string',
        helpText: 'The phone number to send the event to.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'event',
        label: 'Event',
        type: 'string',
        helpText:
          'The event to send. `IS_TYPING` indicates the agent is composing a reply; `READ` marks the user\'s message as read.',
        choices: { IS_TYPING: 'IS_TYPING', READ: 'READ' },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'from',
        label: 'Agent ID',
        type: 'string',
        helpText:
          'The unique ID of your RCS agent. If omitted, the first RCS-capable sender on your account is used.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'msg_id',
        label: 'Message ID',
        type: 'string',
        helpText:
          'The ID of the received RCS the event relates to. Required for `READ`.',
        required: false,
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
