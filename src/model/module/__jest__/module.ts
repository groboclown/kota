
import * as modl from '../module'
import { ParsedError } from '../parse-info'
import { createLogger } from '../../../lib/log'

const LOG = createLogger('model.module.__jest__.module')

describe('module', () => {
  describe('check validity', () => {
    function runMdc(value: any): { hasError: boolean, errors: ParsedError[] } {
      const err: ParsedError[] = []
      LOG.debug('verifying keys', Object.keys(value))
      const ret = modl.ModuleConstraint.runVerify(value, err)
      return { hasError: ret, errors: err }
    }

    describe('with valid', () => {
      function expectValid(value: any) {
        const res = runMdc(value)
        expect(res.hasError).toBe(false)
        expect(res.errors).toHaveLength(0)
      }

      it('fully described', () => {
        expectValid({
          id: 'some-module-name',
          name: 'A Module With A Name',
          version: '1.2.3.4.5.6.7',
          authors: ['a1', 'a2'],
          license: ['l1', 'l2'],
          source: 'a b c',
          description: 'A long description',
          moduleDependencies: ['ab-cd-ef 1.2.3', 'ddf$dfd-1 4.5'],
          hooks: {
            install: 'asdf',
            shutdown: 'foo'
          }
        })
      })

      it('minimally described', () => {
        expectValid({
          id: 'some-module-name',
          name: 'A Module With A Name',
          version: '12',
          authors: ['a'],
          license: ['l'],
          source: 'a b c',
          description: 'A long description'
        })
      })
    })
  })
})
