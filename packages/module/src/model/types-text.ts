
export * from './validator'
export * from './schema'

import {
  TextFragment,
  VariableTextData,
  ContextVariableTextData,
  MessageTextData,
  LinkTextData,
  ModuleHeader,
  FileStructure,
  SpanStyle,
} from './schema'
export interface ModuleContents {
  about: ModuleHeader
  contents: FileStructure
}

const STYLED_PREFIX = 'styled-'
const VAR_DATA = 'var'
const CONTEXT_DATA = 'context'
const LINK_DATA = 'link'
const TEXT_DATA = 'text'

export function hasVariableTextData(v: TextFragment | VariableTextData): v is VariableTextData {
  return isDataType(VAR_DATA, v as any)
}

export function hasMessageTextData(v: TextFragment | MessageTextData): v is MessageTextData {
  return isDataType(TEXT_DATA, v as any)
}

export function hasContextVariableTextData(v: TextFragment | ContextVariableTextData): v is ContextVariableTextData {
  return isDataType(CONTEXT_DATA, v as any)
}

export function hasLinkTextData(v: TextFragment | LinkTextData): v is LinkTextData {
  return isDataType(LINK_DATA, v as any)
}

export function isStyled(value: TextFragment | SpanStyle): value is SpanStyle {
  const v: any = value
  return typeof v.type === 'string' && v.type.startsWith(STYLED_PREFIX)
}

function isDataType(datatype: string, v: TextFragment): boolean {
  return v.type === datatype || v.type.endsWith(datatype)
}
