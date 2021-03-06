import lowdb from 'lowdb'
import lodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'

const getConfig = (configPath: string): lowdb.LowdbSync<any> => {
  const adapter = new FileSync(configPath, {
    deserialize: (data: string): Function => {
      return (new Function(`return ${data}`))()
    }
  })
  const db = lowdb(adapter)
  db._.mixin(lodashId)

  if (!db.has('picBed').value()) {
    db.set('picBed', {
      current: 'smms'
    }).write()
  }
  if (!db.has('plugins').value()) {
    db.set('plugins', {}).write()
  }

  return db
}

const saveConfig = (configPath: string, config: any): void => {
  const db = getConfig(configPath)
  Object.keys(config).forEach((name: string) => {
    db.read().set(name, config[name]).write()
  })
}

export {
  getConfig,
  saveConfig
}
