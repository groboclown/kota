/**
 * Text output format.  For easier conversion.
 */

export const BLOCK_STYLE_PARA = 'para'
export const BLOCK_STYLE_QUOTE = 'quote'
export const BLOCK_STYLE_SIGNAURE = 'signature'
export const BLOCK_STYLE_HEADER = 'header'
export const BLOCK_STYLE_SUBHEAD = 'subhead'
export const BLOCK_STYLE_END = 'end' // end-of-line aligned
export const BLOCK_STYLE_HLINE = 'section'  // start a "section", usually indicated by a horizontal line.
export const BLOCK_STYLES = [
  BLOCK_STYLE_PARA, BLOCK_STYLE_QUOTE, BLOCK_STYLE_SIGNAURE, BLOCK_STYLE_HEADER, BLOCK_STYLE_SUBHEAD,
  BLOCK_STYLE_END //, BLOCK_STYLE_HLINE
]

export type FontFamily = string
export type BlockStyle = string

/**
 * The block-level description of the text.  This describes the indentation, margin, and alignment of the text.
 */
export interface OutputBlock {
  blockStyle: BlockStyle
  text: OutputText[]
}

export interface OutputStyle {
  weight: number
  slant: number
  underline: number
  strikethrough: number
}

export interface OutputText {
  text: string
}

export interface OutputStyledText extends OutputText {
  style: OutputStyle
}

export interface LinkedText {
  link: string
}

export interface OutputLink extends OutputText, LinkedText {
}

export interface OutputStyledLink extends OutputStyledText, LinkedText {
}
