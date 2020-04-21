#!/usr/bin/env node

/*
 * Generates documentation based on the schema.
 * The documentation is for the `site` directory, and checked into
 * source control so it can be published on the site.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const util = require('util')
const json2md = require('@adobe/jsonschema2md/lib')

const config = {
  base_json_out: path.resolve('./../../site/schema/json'),
  base_md_out: path.resolve('./../../site/schema/docs'),
  base_src: path.resolve('./../file-schema'),
  basedir_names: ['compiled', 'user'],
  inout_mapping: {},
  errors: [],
}

// Process the source files.  This means converting yaml to json.
config.basedir_names.forEach(name => {
  let sourceDir = path.resolve(config.base_src, name)
  let jsonTargetDir = path.resolve(config.base_json_out, name)
  let mdTargetDir = path.resolve(config.base_md_out, name)
  fs.mkdirSync(jsonTargetDir, {recursive: true})
  fs.mkdirSync(mdTargetDir, {recursive: true})
  fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter(ent => ent.isFile() && ent.name.endsWith(".yaml"))
    .forEach(ent => {
      let sourceFile = path.resolve(sourceDir, ent.name)
      if (ent.name.endsWith(".md")) {
        // Just copy the file to the markdown dir
        let outFile = path.resolve(mdTargetDir, ent.name)
        const data = fs.readFileSync(sourceFile, 'utf8')
        fs.writeFileSync(outFile, data)
        console.log(`INFO Copied ${sourceFile} to ${outFile}`)
      }
      if (ent.name.endsWith(".yaml")) {
        let outFileName = ent.name.substring(0, ent.name.length - 5) + '.json'
        let outFile = path.resolve(jsonTargetDir, outFileName)
        const data = fs.readFileSync(sourceFile, 'utf8')
        let raw = {}
        try {
          raw = yaml.safeLoadAll(data)
        } catch (e) {
          console.error(`FORMAT ERROR!  ${e.message}: ${sourceFile}`)
          config.errors.push(e.message)
          return
        }
        if (util.isArray(raw) && raw.length === 1) {
          raw = raw[0]
        }
        if (util.isArray(raw) || util.isObject(raw)) {
          fs.writeFileSync(outFile, JSON.stringify(raw))
        } else {
          console.error(`CONTENT ERROR!  Unsupported content: ${sourceFile}`)
          config.errors.push(`CONTENT ERROR!  Unsupported content: ${sourceFile}`)
          return
        }
      } else {
        console.log(`INFO ignoring source file ${sourceFile}`)
      }
    })
  // Perform json schema -> markdown conversion.
  // This isn't good.  It also generates an "out" directory
  // that isn't part of the output directory, and will cause broken
  // pages.
  json2md([
    '-d', jsonTargetDir,
    '-o', mdTargetDir,
    '-f', 'yaml',
  ])
})
