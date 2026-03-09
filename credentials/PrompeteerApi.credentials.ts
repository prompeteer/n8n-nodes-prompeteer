import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class PrompeteerApi implements ICredentialType {
  name = 'prompeteerApi';
  displayName = 'Prompeteer API';
  documentationUrl = 'https://prompeteer.ai/connect';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      placeholder: 'pk_live_...',
      description:
        'Your Prompeteer API key. Get one free at Settings → Integrations on prompeteer.ai.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://prompeteer.ai',
      url: '/api/mcp/api-keys/health',
      method: 'GET',
    },
  };
}
