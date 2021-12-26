export interface ResponseContentSchema {
  type: string,
  properties?: any,
  items?: any
}

export interface ResponseContent {
  schema: ResponseContentSchema
}

export interface ResponseContents {
  [key: string]: ResponseContent
}

export interface ResponseObject {
  description: string,
  content?: ResponseContents
}

export interface ResponsesObject {
  [key: string]: ResponseObject
}

export interface OperationObject {
  summary: string;
  description: string;
  tags: string[],
  responses: ResponsesObject
}
