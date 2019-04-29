
import * as tx from '../text'
import * as md from '../md-parser'

describe('parseMd', () => {
    describe('given valid input', () => {
        describe('with no format marks', () => {
            describe('expect single block', () => {
                it('with empty input', () => {
                    const res = md.parseMd('')
                    expect(res).toHaveLength(0)
                })
                it('with simple plain text', () => {
                    const res = md.parseMd('text')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'text' }]
                    })
                })
                it('with a continuation line for single \\n', () => {
                    const res = md.parseMd('a\nb')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'a b' }]
                    })
                })
                it('with a continuation line for a windows newline', () => {
                    const res = md.parseMd('a\r\nb')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'a b' }]
                    })
                })
                it('with a continuation line for single \\n and leading whitespace on continued line', () => {
                    const res = md.parseMd('a\n   b')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'a b' }]
                    })
                })
                it('with leading and trailing whitespace', () => {
                    const res = md.parseMd('  a  ')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'a' }]
                    })
                })
                it('with whitespace consolidation', () => {
                    const res = md.parseMd('a       b')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'a b' }]
                    })
                })
                it('with leading and trailing EOLs', () => {
                    const res = md.parseMd('\r\n\r\n\n\n\ra\r\r\r\n\n\n\r')
                    expect(res).toHaveLength(1)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'a' }]
                    })
                })
            })
            describe('expect multiple blocks', () => {
                it('with two simple blocks', () => {
                    const res = md.parseMd('ab\n\ncd')
                    expect(res).toHaveLength(2)
                    expect(res[0]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'ab' }]
                    })
                    expect(res[1]).toEqual(<tx.OutputBlock>{
                        blockStyle: 'para',
                        text: [{ text: 'cd' }]
                    })
                })
            })
        })
    })
})
