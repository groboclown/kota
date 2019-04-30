#!/usr/bin/nodejs

const fs = require('fs')
const path = require('path')
const { compile } = require('json-schema-to-typescript')
const yaml = require('yaml')
const util = require('util')

const config = {
  out: path.resolve('./src/model/schema'),
  src: []
}

let mode = ['x']
process.argv.forEach(val => {
  if (val === '-o' || val === '-i') {
    mode[0] = val
  } else if (mode[0] === '-o') {
    config.out = path.resolve(val)
    mode[0] = 'x'
  } else if (mode[0] === '-i') {
    const src = path.resolve(val)
    const fst = fs.lstatSync(src)
    if (fst.isFile() && src.endsWith('.yaml') || src.endsWith('.yml')) {
      config.src.push(src)
    } else {
      console.error(`SKIPPING!  Not a YAML file: ${src}`)
    }
  }
})

let errorCount = [0]
console.log(`Generating sources into "${config.out}"`)
Promise.all(config.src.map(fn => {
  let coreName = path.basename(fn)
  if (!coreName.endsWith('.schema.yaml')) {
    throw new Error(`Bad input file: ${fn}`)
  }
  coreName = coreName.substring(0, coreName.length - 12)
  let className = coreName[0].toUpperCase() + coreName.substring(1)
  let outFile = path.join(config.out, coreName + '.ts')
  return new Promise((resolve, reject) => {
    fs.readFile(fn, 'utf8', (err, text) => {
      if (err) {
        reject(err)
      } else {
        resolve(text)
      }
    })
  })
    .then((text) => {
      let raw
      try {
        raw = yaml.parseAllDocuments(text)
      } catch (e) {
        console.error(`FORMAT ERROR!  ${e.message}: ${fn}`)
        errorCount[0]++
        return
      }
      if (util.isArray(raw) && raw.length === 1) {
        raw = raw[0]
      }
      if (util.isObject(raw)) {
        // For some weird reason, the schema-to-ts converter does not
        // like the yaml-parsed objects.  So strip all that pretense
        // and turn it into a pure object in probably the least
        // efficient manner possible.
        const value = JSON.parse(JSON.stringify(raw))
        return compile(value, className, {
          bannerComment: '',
          style: {
            bracketSpacing: false,
            printWidth: 120,
            semi: false,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'all',
            useTabs: false
          }
        })
          .then(ts => {
            const contents =
              `/* AUTO GENERATED FILE.  DO NOT MODIFY. */\n/* tslint:disable */\nimport { SchemaVerifier } from '../validator'\n\n${
              ts
              }\nconst JSON_SCHEMA = ${
              JSON.stringify(raw, null, 2)
              }\nexport const VALIDATOR = new SchemaVerifier<${
              className
              }>("${coreName}", JSON_SCHEMA)\n`
            return new Promise((resolve, reject) => {
              fs.writeFile(outFile, contents, (err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            })
          })
      } else {
        console.error(`CONTENT ERROR!  Unsupported content: ${fn}`)
        errorCount[0]++
        return
      }
    })
    .catch((e) => {
      console.error(e)
      errorCount[0]++
    })
}))
  .then(() => {
    if (errorCount[0] > 0) {
      process.exit(1)
    }
  })
