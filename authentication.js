module.exports = {
  type: 'oauth2',
  test: {
    headers: { Authorization: 'Bearer {{bundle.authData.access_token}}' },
    url: 'https://oauth.seven.io/me',
  },
  oauth2Config: {
    authorizeUrl: {
      url: 'https://oauth.seven.io/authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken: {
      body: {
        code: '{{bundle.inputData.code}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        grant_type: 'authorization_code',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
      url: 'https://oauth.seven.io/token',
    },
    refreshAccessToken: {
      body: {
        refresh_token: '{{bundle.authData.refresh_token}}',
        grant_type: 'refresh_token',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
      url: 'https://oauth.seven.io/token',
    },
    autoRefresh: true,
    scope:
      'analytics balance contacts hooks journal lookup pricing sms status subaccounts validate_for_voice voice',
  },
  connectionLabel:
    '{{bundle.inputData.email}} (ID: {{bundle.inputData.user_id}})',
};
