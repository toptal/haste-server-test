const api = {
  url: 'https://www.toptal.com/developers/hastebin/api',
  endpoints: {
    documents: {
      url: 'https://www.toptal.com/developers/hastebin/documents',
      name: 'documents',
      input: 'Hello World!',
      output: '{ "key": "aeiou" }',
      hostname: 'www.toptal.com',
      path: '/developers/hastebin/documents'
    },
    raw: {
      url: 'https://www.toptal.com/developers/hastebin/raw',
      name: 'raw',
      input: 'aeiou',
      output: 'Hello World!',
      hostname: 'www.toptal.com',
      path: '/developers/hastebin/raw'
    }
  }
}

const actions = {
  copyToClipboard: 'Copy to Clipboard',
  copyURL: 'Copy Shareable URL',
  downloadRaw: 'Download RAW File',
  duplicateText: 'Duplicate Text',
  generateToken: 'Generate Token',
  save: 'Save',
  signInButton: 'Sign in with Github',
  startNewBin: 'Start a New Text',
  urlCopyNotification: 'URL copied',
  urlCopyErrorNotification: 'URL could not be copied',
  codeCopyNotification: 'Text copied',
  codeCopyErrorNotification: 'Error occured while copying'
}

const messages = {
  binNotFound: `We're sorry, but the contents of the bin could not be found or it has been deleted.`,
  newTextModalPrompt:
    'To start a new text you will erase everything it was entered before and will start a new blank canvas, are you sure?'
}

const titles = {
  aboutHastebin: 'About Hastebin',
  aboutHastebinQuestion: 'What is Hastebin?',
  documentation: 'Documentation',
  documentationVariant: 'Hastebin API Documentation',
  apiVariant: 'Hastebin API',
  examples: 'Programming Language Examples'
}

const project = {
  url: 'https://www.toptal.com/developers/hastebin'
}

const documentationText = {
  part1:
    'Hastebin has a free public API to be used programmatically in any application.',
  part2:
    'Get here all the needed information to use it with multiple languages.',
  authInfo: (userName: string): string =>
    `Signed in as ${userName} from Github.`,
  authPart1:
    ' Sign in with your Github account, generate a token and start to use the Hastebin API.',
  authPart2: 'As an authenticated user, your pasted content will stay longer: ',
  authPart3: '30 days.',
  authPart4:
    ' Important, you just can have one active token at a time and there will be a strict limit of 100 requests per minute for plain-text conversions.'
}

export const siteCopy = {
  actions,
  titles,
  api,
  messages,
  project,
  documentationText
}
