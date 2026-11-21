const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const root = path.resolve(__dirname, '../..')
const manifest = require('./dependency-patches.json')
const check = process.argv.includes('--check')
const hash = (text) => crypto.createHash('sha256').update(text).digest('hex')
const writes = []
// Validate every original before modifying anything. Dependency drift fails closed.
for (const patch of manifest.patches) {
  const file = path.resolve(root, 'node_modules', patch.path)
  if (!file.startsWith(path.join(root, 'node_modules') + path.sep))
    throw new Error('Invalid patch path')
  const original = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  if (original !== null && hash(original) === patch.afterHash) continue
  if (check) throw new Error(`Security patch missing or changed: ${patch.path}`)
  if ((original === null ? null : hash(original)) !== patch.beforeHash)
    throw new Error(`Dependency changed; review security patch: ${patch.path}`)
  let next = patch.content ?? original
  for (const edit of patch.edits ?? []) {
    if (next.split(edit.before).length !== 2)
      throw new Error(`Ambiguous security patch: ${patch.path}`)
    next = next.replace(edit.before, edit.after)
  }
  if (hash(next) !== patch.afterHash)
    throw new Error(`Security patch integrity failed: ${patch.path}`)
  writes.push([file, next])
}
for (const [file, content] of writes) fs.writeFileSync(file, content)
console.log(
  check
    ? 'Security patch integrity verified.'
    : `Security patches applied: ${writes.length} files.`,
)
