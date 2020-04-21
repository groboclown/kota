#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const util = require('util')

const config = {
  out: path.resolve('./.gen'),
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
console.log(`Generating json into "${config.out}"`)
config.src.forEach(fn => {
  let outFile = path.join(config.out, path.basename(fn))
  if (outFile.endsWith('.yaml')) {
    outFile = outFile.substring(0, outFile.length - 5) + '.json'
  } else if (outFile.endsWith('.yml')) {
    outFile = outFile.substring(0, outFile.length - 4) + '.json'
  } else {
    outFile = outFile + '.json'
  }
  const data = fs.readFileSync(fn, 'utf8')
  let raw
  try {
    raw = yaml.parseAllDocuments(data)
  } catch (e) {
    console.error(`FORMAT ERROR!  ${e.message}: ${fn}`)
    errorCount[0]++
    return
  }
  if (util.isArray(raw) && raw.length === 1) {
    raw = raw[0]
  }
  if (util.isArray(raw) || util.isObject(raw)) {
    fs.writeFileSync(outFile, JSON.stringify(raw))
  } else {
    console.error(`CONTENT ERROR!  Unsupported content: ${fn}`)
    errorCount[0]++
    return
  }
})

if (errorCount[0] > 0) {
  process.exit(1)
}
