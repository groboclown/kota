import ajv from 'ajv'
import * as lib from '@kota/base-libs'

const AJV = new ajv({ allErrors: true })
export class SchemaVerifier<T> {
  private readonly verifier: ajv.ValidateFunction

  constructor(readonly name: string, schema: any) {
    this.verifier = AJV.compile(schema)
  }

  validate(srcfile: string, obj: any, errors?: lib.ErrorValue[]): obj is T {
    if (!this.verifier(obj)) {
      if (errors && this.verifier.errors) {
        for (const e of this.verifier.errors) {
          errors.push(lib.coreError('invalid file schema format', {
            path: srcfile,
            schema: this.name,
            keyword: e.keyword,
            dataPath: e.dataPath,
            schemaPath: e.schemaPath,
            params: JSON.stringify(e.params),
            message: e.message || '(no message)',
            propertyName: e.propertyName || '(no property)',
          }))
        }
      }
      return false
    }
    return true
  }
}
