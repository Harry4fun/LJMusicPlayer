export default class Singer {
  constructor({id, name, singerId}) {
    this.id = id
    this.name = name
    this.singer_id = singerId
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
  }
}
