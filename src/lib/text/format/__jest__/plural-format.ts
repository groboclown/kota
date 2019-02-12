
// Import the index so that all the formats are correctly registered.
import * as ft from '../index'
import * as pl from '../plural-format'
import * as lut from './loc-util'
import { Context, Internal, VALUE_NUMBER, NumberInternal } from '../../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../../core-paths'
import {
    StorageContext,
} from '../../../../model/intern'


const PLURAL = new pl.FormatPlural()
const LOC = new lut.MockLoc([])

describe('format plural', () => {
    function mkCtx(arg: number): Context {
        const d: { [key: string]: Internal } = {
            [CURRENT_FUNCTION_ARGUMENT_0_PATH]: new NumberInternal(VALUE_NUMBER, arg)
        }
        return new StorageContext(d)
    }

    it('is loaded', () => {
        expect(ft.PLURAL_FORMAT_LOADED).toBe(true)
    })
    describe('with plain input', () => {
        it('returns the right value', () => {
            const ret = PLURAL.format(mkCtx(100), '/x:a', LOC)
            // Uses the mock l10n to return domain@msgid@value
            expect(ret).toEqual({ text: '/x@a@100' })
        })
    })
    describe('with count xlate', () => {
        it('returns count-enabled string', () => {
            LOC.tlate['/b:a'] = { 2: '2 coins', 200: 'jackpot of coins' }
            const ret = PLURAL.format(mkCtx(200), '/b:a', LOC)
            expect(ret).toEqual({ text: 'jackpot of coins' })
        })
        it('returns number formatted string', () => {
            LOC.tlate['/b:c'] = 'x {c:count;,} y'
            const ret = PLURAL.format(mkCtx(20000), '/b:c', LOC)
            expect(ret).toEqual({ text: 'x C?AAAA y' })
        })
    })
})
