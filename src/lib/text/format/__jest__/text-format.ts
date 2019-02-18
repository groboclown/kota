
// Import the index so that all the formats are correctly registered.
import * as ft from '../index'
import * as pl from '../text-format'
import * as lut from './loc-util'
import { Context, Internal, NumberInternal, joinPaths, PATH_SEPARATOR } from '../../../context'
import { CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../../core-paths'
import {
    StorageContext,
    SplitContext,
    PointerContext
} from '../../../../model/intern'


const TEXT = new pl.FormatText()
const LOC = new lut.MockLoc([])

describe('format text', () => {
    const COUNT_PATH = joinPaths(CURRENT_FUNCTION_ARGUMENTS_PATH, '@count')
    function mkCtx(arg: number): Context {
        const d: { [key: string]: Internal } = {
            [COUNT_PATH]: new NumberInternal('/x', arg)
        }
        return new StorageContext(d)
    }

    it('is loaded', () => {
        expect(ft.TEXT_FORMAT_LOADED).toBe(true)
    })
    describe('with plain input', () => {
        it('returns the right value', () => {
            const ret = TEXT.format(mkCtx(100), '/x:a', LOC)
            // Uses the mock l10n to return domain@msgid@value
            expect(ret).toEqual({ text: '/x@a@100' })
        })
    })
    describe('with count xlate', () => {
        it('returns count-enabled string', () => {
            LOC.tlate['/b:a'] = { 2: '2 coins', 200: 'jackpot of coins' }
            const ret = TEXT.format(mkCtx(200), '/b:a', LOC)
            expect(ret).toEqual({ text: 'jackpot of coins' })
        })
        it('returns number formatted string', () => {
            LOC.tlate['/b:c'] = 'x {c:/current/function/arguments/@count;,} y'
            const ret = TEXT.format(mkCtx(20000), '/b:c', LOC)
            expect(ret).toEqual({ text: 'x C?AAAA y' })
        })
    })
})
