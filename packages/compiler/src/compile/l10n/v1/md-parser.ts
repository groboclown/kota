
import {
    OutputStyle, OutputText, OutputStyledText,
    BLOCK_STYLES, BlockStyle, OutputBlock,
    BLOCK_STYLE_PARA,
    BLOCK_STYLE_HEADER,
    BLOCK_STYLE_SUBHEAD,
    BLOCK_STYLE_SIGNAURE,
    BLOCK_STYLE_QUOTE,
    BLOCK_STYLE_RIGHT,
    BLOCK_STYLE_HLINE,
    OutputStyledLink,
    OutputLink
} from './text'

const DEFAULT_TEXT_STYLE: OutputStyle = {
    weight: 0,
    slant: 0,
    underline: 0,
    strikethrough: 0
}
const DEFAULT_BLOCK_STYLE: BlockStyle = BLOCK_STYLE_PARA


const MD_BLOCK_START = 0
const MD_NORMAL_CHARACTER = 1
const MD_NORMAL_NO_RESCAN = 2
const MD_ESCAPE_SEQUENCE = 3
const MD_WHITESPACE = 7
const MD_EOL = 8
const MD_EOL_CONTINUATION = 9
const MD_BLOCK_HEADER_1 = 10
const MD_BLOCK_HEADER_2 = 11
const MD_BLOCK_SIG_1 = 12
const MD_BLOCK_SIG_2 = 13
const MD_BLOCK_GT_1 = 14
const MD_BLOCK_GT_2 = 15
const MD_BLOCK_GT_3 = 16
const MD_HLINE = 17
const MD_STAR_START = 30
const MD_STAR_END = 31
const MD_UNDERSCORE_START = 32
const MD_UNDERSCORE_END = 33
const MD_DASH_START = 34
const MD_DASH_END = 35
const MD_EQUAL_START = 36
const MD_EQUAL_END = 37
const MD_LINK_TEXT = 50
const MD_LINK_TEXT_ESCAPE = 51
const MD_LINK_TEXT_WHITESPACE = 52
const MD_LINK_NEXT = 55
const MD_LINK_TO = 56
const MD_LINK_TO_ESCAPE = 57


const UNUSED_BLOCK: OutputBlock = {
    blockStyle: DEFAULT_BLOCK_STYLE,
    text: []
}

/**
 * A markdown inspired format.
 *
 * A single newline, by itself, is considered a continuation of the previous line, and is
 * not a new block.
 *
 * Non-continued lines that start with special characters indicate a block style:
 * `# ` => header, `## ` => subheader, `// ` => signature, `>>> ` => right, `> ` => quote.
 * `---` => hline (no text is part of this block)
 * Anything else is a normal paragraph.
 *
 * Text that is wrapped by `*` is bold, `_` underline, `-` strikethrough, `=` italics.
 * Multiples next to each other increases the intensity (double underlines, multiple strikethroughs,
 * heavier bold, etc).  Use `\` as the escape character.  A single corresponding mark will
 * reset the count, and multiple tailing marks will be consolidated into one.
 *
 * Links are in the standard [viewed](linked to) format.  Link viewed text cannot be internally styled.
 *
 * Multiple unescaped whitespace is trimmed down to a single whitespace.  There will be some weird
 * situations that lead to trailing whitespace included in text, but for the most part it is not added.
 * The weird situations won't be handled due to simplifying the logic.
 */
export function parseMd(text: string): OutputBlock[] {
    // WARNING this code should be considered highly critical.  It's run for almost every string,
    // so it must be highly performant.  Aim to make simplifying assumptions or simplified formatting
    // in service of optimizing the common paths.  Unusual or error paths may be make more complex.

    const roots: OutputBlock[] = []

    // "current" should only be not used at the very start.  We'll always replace this,
    // but to prevent excessive null checks, we'll assign it to a simple object that will
    // never be used.  This is a constant because its values should never be written to.
    var current: OutputBlock = UNUSED_BLOCK
    var buff = ''
    var currentStyle: OutputStyle | null = null
    var state = MD_BLOCK_START
    var currentStyleMark = ''

    /** Found the first character for a style, so parse its meaning. */
    function updateForStartStyle(styleKey: keyof OutputStyle, startState: number, endState: number) {
        if (buff.length > 0) {
            if (currentStyle) {
                current.text.push(<OutputStyledText>{ text: buff, style: currentStyle })
            } else {
                current.text.push({ text: buff })
            }
            buff = ''
        }
        if (currentStyle && currentStyle[styleKey] > 0) {
            currentStyle[styleKey] = 0
            // NOTE this is explicitly checking each item.  If this list grows, then
            // someone must remember to change this as well.
            if (currentStyle.weight <= 0
                && currentStyle.slant <= 0
                && currentStyle.underline <= 0
                && currentStyle.strikethrough <= 0) {
                currentStyle = null
            }
            state = endState
            return
        }
        currentStyle = currentStyle || { ...DEFAULT_TEXT_STYLE }
        state = startState
        currentStyle[styleKey] = 1
    }

    /** Already found the first (or more) character for a style, so parse the character's meaning. */
    function updateForStyleMarker(c: string, styleMarker: string, styleKey: keyof OutputStyle) {
        if (!currentStyle) {
            throw new Error(`Invalid state: nextStyle is null in ${styleMarker} style`)
        }
        if (c === styleMarker) {
            currentStyleMark += styleMarker;
            // FIXME without the cast, currentStyle is marked as possibly of "never" type.  Why????
            currentStyle[styleKey]++
            // continue on in the current mode
            return
        }
        // Found a non-current-style character, so it needs to be rescanned.
        state = MD_NORMAL_CHARACTER
    }

    for (var i = 0; i < text.length; i++) {
        const c = text[i]
        // console.log(`Parsing ${c} state ${state}`)
        switch (state) {
            case MD_BLOCK_START:
                // Start of a paragraph.
                // Ignore leading whitespace, including newlines.
                if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
                    break
                }
                // Found some actual text, so mark this as a paragraph.
                current = { blockStyle: DEFAULT_BLOCK_STYLE, text: [] }
                currentStyle = null
                roots.push(current)
                if (c === '#') {
                    state = MD_BLOCK_HEADER_1
                    break
                }
                if (c === '/') {
                    state = MD_BLOCK_SIG_1
                    break
                }
                if (c === '>') {
                    state = MD_BLOCK_GT_1
                    break
                }
                if (c === '-') {
                    currentStyleMark = '-'
                    state = MD_HLINE
                    break
                }
                // This is some other character, so rescan it in normal paragraph mode.
                state = MD_NORMAL_CHARACTER


                // Notes about MD_BLOCK_START:
                // When the state changes to MD_BLOCK_START, you MUST:
                //   - blank out buff
                //   - do not change current or push it onto the roots.
                // All this is so that the final cleanup block at the end of this method
                // works as expected.

                break
            case MD_ESCAPE_SEQUENCE:
                // Found escape character ('\').
                if (c === '\r' || c == '\n') {
                    // Tried to escape a newline.  Because we already have special handling
                    // for line continuation, just treat this like a normal newline.
                    state = MD_EOL
                    currentStyleMark = c
                    break
                }
                // In all other cases, directly add the next character.
                buff += c
                // State === 2 means skip the rescan.
                state = MD_NORMAL_NO_RESCAN
                break
            case MD_WHITESPACE:
                // Found some whitespace inside plain text, which has not yet been added to the
                // buffer.
                if (c === ' ' || c === '\t') {
                    // ignore
                    break
                }
                if (c === '\r' || c === '\n') {
                    // Don't include trailing whitespace on a paragraph.  Just go directly to EOL.
                    state = MD_EOL
                    break
                }
                // Add in a single whitespace and rescan the character.
                buff += ' '
                state = MD_NORMAL_CHARACTER
                break
            case MD_EOL:
                // Found EOL (in currentStyleMark).  Might just be by itself (line continuation).
                if (c === currentStyleMark) {
                    // Two of the same EOL marks in a row, mark as a new paragraph.
                    if (buff.length > 0) {
                        if (currentStyle !== null) {
                            current.text.push(<OutputStyledText>{ text: buff, style: currentStyle })
                        } else {
                            current.text.push(<OutputText>{ text: buff })
                        }
                    }
                    state = MD_BLOCK_START
                    buff = ''
                    break
                }
                if (c === '\r' || c === '\n') {
                    // Found the opposite newline character.  That means this was a DOS style newline,
                    // so count as a single newline, and redo this check.
                    break
                }
                // Continuation of the previous paragraph.
                if (c === ' ' || c === '\t') {
                    // Allow for leading whitespace to be ignored in the continued line.
                    state = MD_EOL_CONTINUATION
                    break
                }
                // Transform the line continuation into a single whitespace
                buff += ' '
                // Rescan this character as a normal paragraph character.
                state = MD_NORMAL_CHARACTER
                break
            case MD_EOL_CONTINUATION:
                if (c === ' ' || c === '\t') {
                    // Swallow leading whitespace on the continuation line.
                    break
                }
                if (c === '\r' || c === '\n') {
                    // Found a newline, encountered only whitespace on the
                    // line, then a newline.  Treat as two EOLs thus a new paragrpah.
                    if (buff.length > 0) {
                        if (currentStyle !== null) {
                            current.text.push(<OutputStyledText>{ text: buff, style: currentStyle })
                        } else {
                            current.text.push(<OutputText>{ text: buff })
                        }
                    }
                    state = MD_BLOCK_START
                    buff = ''
                    break
                }
                // Transform the EOL character(s) into a single space.
                buff += ' '
                // Rescan as normal paragraph character.
                state = MD_NORMAL_CHARACTER
                break
            case MD_BLOCK_HEADER_1:
                // Found '#' at start of the block.
                if (c === '#') {
                    // Try a sub-header.
                    currentStyleMark = '#'
                    state = MD_BLOCK_HEADER_2
                    break
                }
                if (c === ' ' || c === '\t') {
                    // In a header.
                    state = MD_NORMAL_NO_RESCAN
                    current.blockStyle = BLOCK_STYLE_HEADER
                    break
                }
                if (c === '\r' || c === '\n') {
                    // The mark is by itself.  This is probably an issue, so we'll ignore it.
                    // It does mean that an extra, empty block was added to the stack.
                    roots.pop()
                    state = MD_BLOCK_START
                    buff = ''
                    break
                }
                // Some other character.  Rescan the character in normal paragraph mode.
                buff = '#'
                state = MD_NORMAL_CHARACTER
                break
            case MD_BLOCK_HEADER_2:
                // Found '##' at start of the block.
                if (c === '#') {
                    // Extra sub-header, which we don't care about.  Just treat it as the first '#'.
                    currentStyleMark += '#'
                    break
                }
                if (c === ' ' || c === '\t') {
                    // In a sub-header.
                    state = MD_NORMAL_NO_RESCAN
                    current.blockStyle = BLOCK_STYLE_SUBHEAD
                    break
                }
                // Some other character.  Rescan the character in normal paragraph mode.
                buff = currentStyleMark
                state = MD_NORMAL_CHARACTER
                break
            case MD_BLOCK_SIG_1:
                // Found '/' at start of the block.
                if (c === '/') {
                    // Probably an intentional signature.
                    state = MD_BLOCK_SIG_2
                    break
                }
                // Some other character.  Rescan the character in normal paragraph mode.
                state = MD_NORMAL_CHARACTER
                buff = '/'
                break
            case MD_BLOCK_SIG_2:
                // Found '//' at start of the block.
                if (c === ' ' || c === '\t') {
                    // Signature block.
                    state = MD_NORMAL_NO_RESCAN
                    current.blockStyle = BLOCK_STYLE_SIGNAURE
                    break
                }
                // Some other character.  Rescan the character in normal paragraph mode.
                state = MD_NORMAL_CHARACTER
                buff = '//'
                break
            case MD_BLOCK_GT_1:
                // Found '>' at start of the block.
                if (c === ' ' || c === '\t') {
                    // Move to quote block
                    state = MD_NORMAL_NO_RESCAN
                    current.blockStyle = BLOCK_STYLE_QUOTE
                    break
                }
                if (c === '>') {
                    // could be a right block.
                    state = MD_BLOCK_GT_2
                    break
                }
                // Some other character.  Rescan in paragraph mode.
                state = MD_NORMAL_CHARACTER
                buff = '>'
                break
            case MD_BLOCK_GT_2:
                // Found '>>' at start of the block.
                if (c === '>') {
                    // probably in right paragraph mode.
                    state = MD_BLOCK_GT_3
                    break
                }
                // Some other character.  Rescan in paragraph mode.
                state = MD_NORMAL_CHARACTER
                buff = '>>'
                break
            case MD_BLOCK_GT_3:
                // Found '>>>' at start of the block.
                if (c === ' ' || c === '\t') {
                    // in right mode.
                    state = MD_NORMAL_NO_RESCAN
                    current.blockStyle = BLOCK_STYLE_RIGHT
                    break
                }
                // Some other character.  Rescan in paragraph mode.
                state = MD_NORMAL_CHARACTER
                buff = '>>>'
                break
            case MD_HLINE:
                // Found '-' characters at start of the block.
                if (c === '-') {
                    currentStyleMark += c
                    // Could be a horiz line.  Depends on what's next on the line.
                    break
                }
                if (currentStyleMark.length >= 3 && c === '\r' || c === '\n') {
                    // horiz line
                    current.blockStyle = BLOCK_STYLE_HLINE
                    state = MD_BLOCK_START
                    buff = ''
                    break
                }
                // Some other character.  Rescan in paragraph mode.
                state = MD_NORMAL_CHARACTER
                buff = currentStyleMark
                break
            case MD_STAR_START:
                // Found starting '*' mark, might be more
                updateForStyleMarker(c, '*', 'weight')
                break
            case MD_STAR_END:
                // Found ending '*' mark, might be more.
                // All the style updates have aleady happened.  Just need to
                // handle the case of multiple markers.
                if (c !== '*') {
                    state = MD_NORMAL_CHARACTER
                }
                break
            case MD_UNDERSCORE_START:
                // Found starting '_' mark, might be more
                updateForStyleMarker(c, '_', 'underline')
                break
            case MD_UNDERSCORE_END:
                // Found ending '_' mark, might be more.
                if (c !== '_') {
                    state = MD_NORMAL_CHARACTER
                }
                break
            case MD_DASH_START:
                // Found starting '-' mark, might be more
                updateForStyleMarker(c, '-', 'strikethrough')
                break
            case MD_DASH_END:
                // Found ending '-' mark, might be more.
                if (c !== '-') {
                    state = MD_NORMAL_CHARACTER
                }
                break
            case MD_EQUAL_START:
                // Found starting '=' mark, might be more
                updateForStyleMarker(c, '=', 'slant')
                break
            case MD_EQUAL_END:
                // Found ending '=' mark, might be more.
                if (c !== '=') {
                    state = MD_NORMAL_CHARACTER
                }
                break
            case MD_LINK_TEXT:
                // Inside link plain text
                if (c === '\\') {
                    state = MD_LINK_TEXT_ESCAPE
                    break
                }
                if (c === '\r' || c === '\n' || c === ' ' || c === '\t') {
                    // simplified EOL handling.
                    state = MD_LINK_TEXT_WHITESPACE
                    break
                }
                if (c === ']') {
                    state = MD_LINK_NEXT
                    break
                }
                buff += c
                break
            case MD_LINK_TEXT_ESCAPE:
                // Found an escape character inside a link text block.
                buff += c
                state = MD_LINK_TEXT
                break
            case MD_LINK_TEXT_WHITESPACE:
                if (c === ']') {
                    // Skip trailing whitespace
                    state = MD_LINK_NEXT
                    break
                }
                if (c !== '\r' && c !== '\n' && c !== ' ' && c !== '\t') {
                    // Condense whitespace into a single space.
                    buff += ' '
                    // And go back to link text parsing.
                    state = MD_LINK_TEXT
                    break
                }
                // Found whitespace - no state change.
                break
            case MD_LINK_NEXT:
                // Found ], expecting a '('
                if (c === '\r' || c === '\n') {
                    // newline is fine between these two.
                    break
                }
                if (c === '(') {
                    currentStyleMark = ''
                    state = MD_LINK_TO
                    break
                }
                // Some other character.  It's not a link, but
                // we've already gone this far...
                state = MD_NORMAL_CHARACTER
                break
            case MD_LINK_TO:
                // Inside link-to text.
                if (c === '\\') {
                    state = MD_LINK_TO_ESCAPE
                    break
                }
                if (c === ')') {
                    // Completed the whole link.
                    if (currentStyle) {
                        current.text.push(<OutputStyledLink>{
                            text: buff,
                            link: currentStyleMark,
                            style: currentStyle
                        })
                    } else {
                        current.text.push(<OutputLink>{
                            text: buff,
                            link: currentStyleMark
                        })
                    }
                    buff = ''
                    currentStyleMark = ''
                    // Gobbled the character; don't rescan it.
                    state = MD_NORMAL_NO_RESCAN
                    break
                }
                currentStyleMark += c
                break
            case MD_LINK_TO_ESCAPE:
                currentStyleMark += c
                state = MD_LINK_TO
                break
        }

        // Because of character rescanning, we have explicitly moved this
        // down to its own section, outside the state check.
        if (state === MD_NORMAL_CHARACTER) {
            // Inside normal paragraph
            if (c === '\n' || c === '\r') {
                state = MD_EOL
                currentStyleMark = c
            } else if (c === ' ' || c === '\t') {
                state = MD_WHITESPACE
            } else if (c === '*') {
                currentStyleMark = c
                updateForStartStyle('weight', MD_STAR_START, MD_STAR_END)
            } else if (c === '_') {
                currentStyleMark = c
                updateForStartStyle('underline', MD_UNDERSCORE_START, MD_UNDERSCORE_END)
            } else if (c === '-') {
                currentStyleMark = c
                updateForStartStyle('strikethrough', MD_DASH_START, MD_DASH_END)
            } else if (c === '=') {
                currentStyleMark = c
                updateForStartStyle('slant', MD_EQUAL_START, MD_EQUAL_END)
            } else if (c === '\\') {
                state = MD_ESCAPE_SEQUENCE
            } else if (c === '[') {
                if (buff.length > 0) {
                    if (currentStyle) {
                        current.text.push(<OutputStyledText>{
                            text: buff,
                            style: currentStyle
                        })
                    } else {
                        current.text.push({ text: buff })
                    }
                    buff = ''
                }
                state = MD_LINK_TEXT
            } else {
                // Normal character; keep going in this state.
                buff += c
            }
        }
        // For those that need to skip the rescan...
        if (state === MD_NORMAL_NO_RESCAN) {
            state = MD_NORMAL_CHARACTER
        }
    }
    if (buff.length > 0) {
        if (currentStyle) {
            current.text.push(<OutputStyledText>{
                text: buff,
                style: currentStyle
            })
        } else {
            current.text.push({
                text: buff
            })
        }
        // console.log(`last current is ${JSON.stringify(current)}`)
    } else {
        if (current.text.length <= 0) {
            // No extra paragraph was added, so remove it.
            roots.pop()
        }
    }
    // console.log(`roots are ${JSON.stringify(roots)}`)

    return roots
}
