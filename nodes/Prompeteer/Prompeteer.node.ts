import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  JsonObject,
  NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';

export class Prompeteer implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Prompeteer',
    name: 'prompeteer',
    icon: 'file:prompeteer.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description:
      'Generate, score, and enhance AI prompts for 140+ platforms using Prompeteer.ai',
    defaults: {
      name: 'Prompeteer',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'prompeteerApi',
        required: true,
      },
    ],
    properties: [
      // ------------------------------------------------------------------
      // Operation selector
      // ------------------------------------------------------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'generatePrompt',
        options: [
          {
            name: 'Generate Prompt',
            value: 'generatePrompt',
            action: 'Generate an optimized prompt for any AI platform',
            description:
              'Create an expert-crafted prompt for ChatGPT, Claude, Gemini, Midjourney, and 140+ more platforms. Uses your monthly quota.',
          },
          {
            name: 'Score Prompt',
            value: 'scorePrompt',
            action: 'Score a prompt with PromptIQ',
            description:
              'Get a quality score (0-100) across 16 dimensions including structure, clarity, context, and precision. Free — no quota used.',
          },
          {
            name: 'Enhance Prompt',
            value: 'enhancePrompt',
            action: 'Enhance and improve a prompt',
            description:
              'Rewrite any prompt into a professional, optimized version using AI. Free — no quota used.',
          },
        ],
      },

      // ------------------------------------------------------------------
      // Generate Prompt fields
      // ------------------------------------------------------------------
      {
        displayName: 'Prompt Idea',
        name: 'userInput',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: { show: { operation: ['generatePrompt'] } },
        placeholder: 'e.g. Write a blog post about sustainable energy',
        description: 'Describe what you want the AI to do. Prompeteer will generate an optimized prompt.',
      },
      {
        displayName: 'Target Platform',
        name: 'platformId',
        type: 'options',
        default: 'chatgpt',
        displayOptions: { show: { operation: ['generatePrompt'] } },
        description: 'AI platform the prompt is optimized for',
        options: [
          { name: 'ChatGPT', value: 'chatgpt' },
          { name: 'Claude', value: 'claude' },
          { name: 'Gemini', value: 'gemini' },
          { name: 'Midjourney', value: 'midjourney' },
          { name: 'DALL·E', value: 'dalle' },
          { name: 'Stable Diffusion', value: 'stable-diffusion' },
          { name: 'Perplexity', value: 'perplexity' },
          { name: 'Grok', value: 'grok' },
          { name: 'Meta AI', value: 'meta-ai' },
          { name: 'Copilot', value: 'copilot' },
          { name: 'Suno', value: 'suno' },
          { name: 'Runway', value: 'runway' },
          { name: 'Other', value: 'other' },
        ],
      },
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { operation: ['generatePrompt'] } },
        options: [
          {
            displayName: 'Category',
            name: 'category',
            type: 'string',
            default: '',
            placeholder: 'e.g. content-creation, coding, analysis',
            description: 'Prompt category for better optimization',
          },
          {
            displayName: 'Target Audience',
            name: 'targetAudience',
            type: 'string',
            default: '',
            placeholder: 'e.g. developers, marketing teams, students',
            description: 'Who the generated content is for',
          },
          {
            displayName: 'Desired Tone',
            name: 'desiredTone',
            type: 'options',
            default: 'professional',
            options: [
              { name: 'Professional', value: 'professional' },
              { name: 'Casual', value: 'casual' },
              { name: 'Academic', value: 'academic' },
              { name: 'Creative', value: 'creative' },
              { name: 'Technical', value: 'technical' },
              { name: 'Friendly', value: 'friendly' },
            ],
          },
        ],
      },

      // ------------------------------------------------------------------
      // Score Prompt fields
      // ------------------------------------------------------------------
      {
        displayName: 'Prompt Text',
        name: 'promptToScore',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: { show: { operation: ['scorePrompt'] } },
        placeholder: 'Paste the prompt you want to score...',
        description: 'The prompt text to analyze. Max 10,000 characters.',
      },
      {
        displayName: 'Platform (Optional)',
        name: 'scorePlatformId',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['scorePrompt'] } },
        placeholder: 'e.g. chatgpt',
        description: 'Optionally specify the target platform for platform-specific scoring',
      },

      // ------------------------------------------------------------------
      // Enhance Prompt fields
      // ------------------------------------------------------------------
      {
        displayName: 'Prompt Text',
        name: 'promptToEnhance',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: { show: { operation: ['enhancePrompt'] } },
        placeholder: 'Paste the prompt you want to improve...',
        description: 'The prompt text to enhance. Max 10,000 characters.',
      },
      {
        displayName: 'Enhance Options',
        name: 'enhanceOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { operation: ['enhancePrompt'] } },
        options: [
          {
            displayName: 'Category',
            name: 'category',
            type: 'string',
            default: '',
            placeholder: 'e.g. business, coding, marketing',
          },
          {
            displayName: 'Desired Tone',
            name: 'desiredTone',
            type: 'options',
            default: 'professional',
            options: [
              { name: 'Professional', value: 'professional' },
              { name: 'Casual', value: 'casual' },
              { name: 'Academic', value: 'academic' },
              { name: 'Creative', value: 'creative' },
              { name: 'Technical', value: 'technical' },
              { name: 'Friendly', value: 'friendly' },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject;

        // ----------------------------------------------------------------
        // Generate Prompt
        // ----------------------------------------------------------------
        if (operation === 'generatePrompt') {
          const userInput = this.getNodeParameter('userInput', i) as string;

          if (!userInput.trim()) {
            throw new NodeOperationError(
              this.getNode(),
              'Prompt Idea cannot be empty',
              { itemIndex: i },
            );
          }

          const platformId = this.getNodeParameter('platformId', i, 'chatgpt') as string;
          const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as {
            category?: string;
            targetAudience?: string;
            desiredTone?: string;
          };

          const body: Record<string, string> = {
            promptIdea: userInput,
            platformId,
          };

          if (additionalOptions.category) body.category = additionalOptions.category;
          if (additionalOptions.targetAudience) body.targetAudience = additionalOptions.targetAudience;
          if (additionalOptions.desiredTone) body.desiredTone = additionalOptions.desiredTone;

          responseData = (await this.helpers.httpRequestWithAuthentication.call(
            this,
            'prompeteerApi',
            {
              method: 'POST',
              url: 'https://prompeteer.ai/api/mcp/api-keys/generate',
              body,
              json: true,
              timeout: 30000,
            },
          )) as IDataObject;
        }

        // ----------------------------------------------------------------
        // Score Prompt
        // ----------------------------------------------------------------
        else if (operation === 'scorePrompt') {
          const prompt = this.getNodeParameter('promptToScore', i) as string;

          if (!prompt.trim()) {
            throw new NodeOperationError(
              this.getNode(),
              'Prompt Text cannot be empty',
              { itemIndex: i },
            );
          }

          if (prompt.length > 10_000) {
            throw new NodeOperationError(
              this.getNode(),
              'Prompt exceeds maximum length of 10,000 characters',
              { itemIndex: i },
            );
          }

          const platformId = this.getNodeParameter('scorePlatformId', i, '') as string;

          const body: Record<string, string> = { prompt };
          if (platformId) body.platformId = platformId;

          responseData = (await this.helpers.httpRequestWithAuthentication.call(
            this,
            'prompeteerApi',
            {
              method: 'POST',
              url: 'https://prompeteer.ai/api/mcp/api-keys/score',
              body,
              json: true,
              timeout: 15000,
            },
          )) as IDataObject;
        }

        // ----------------------------------------------------------------
        // Enhance Prompt
        // ----------------------------------------------------------------
        else if (operation === 'enhancePrompt') {
          const prompt = this.getNodeParameter('promptToEnhance', i) as string;

          if (!prompt.trim()) {
            throw new NodeOperationError(
              this.getNode(),
              'Prompt Text cannot be empty',
              { itemIndex: i },
            );
          }

          if (prompt.length > 10_000) {
            throw new NodeOperationError(
              this.getNode(),
              'Prompt exceeds maximum length of 10,000 characters',
              { itemIndex: i },
            );
          }

          const enhanceOptions = this.getNodeParameter('enhanceOptions', i, {}) as {
            category?: string;
            desiredTone?: string;
          };

          const body: Record<string, string> = { prompt };
          if (enhanceOptions.category) body.category = enhanceOptions.category;
          if (enhanceOptions.desiredTone) body.desiredTone = enhanceOptions.desiredTone;

          responseData = (await this.helpers.httpRequestWithAuthentication.call(
            this,
            'prompeteerApi',
            {
              method: 'POST',
              url: 'https://prompeteer.ai/api/mcp/api-keys/enhance',
              body,
              json: true,
              timeout: 30000,
            },
          )) as IDataObject;
        }

        // Unknown operation guard
        else {
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i },
          );
        }

        // Return the API response as a single item
        returnData.push({
          json: responseData,
          pairedItem: { item: i },
        });

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }

        if ((error as { statusCode?: number }).statusCode) {
          throw new NodeApiError(this.getNode(), error as JsonObject, {
            itemIndex: i,
          });
        }

        throw error;
      }
    }

    return [returnData];
  }
}
