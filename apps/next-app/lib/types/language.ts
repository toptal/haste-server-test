export enum LanguageTitles {
  Wget = 'wget',
  Curl = 'Curl',
  Nodejs = 'Node.js',
  Python = 'Python',
  Java = 'Java',
  Ruby = 'Ruby',
  Perl = 'Perl',
  Php = 'PHP',
  CSharp = 'C#',
  Kotlin = 'Kotlin',
  Rust = 'Rust',
  Api = 'API',
  Post = 'POST'
}

export enum CodeType {
  FileOutput,
  StringOutput
}

export type Code = {
  title: string
  code: string
  explanation?: string
  command?: string
  output?: string
  type: CodeType
  endpointName?: string
}

export type Language = {
  title: LanguageTitles
  route: string
  codes?: Code[]
  free?: boolean
  slug?: string
}
