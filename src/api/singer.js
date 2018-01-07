import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

//  获取歌手列表
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {

    'channel': 'singer',
    'page': 'list',
    'key': 'all_all_all',
    'pagesize': 100,
    'pagenum': 1,
    'g_tk': '503614143',
    // 'jsonpCallback': 'GetSingerListCallback',
    'loginUin': '504015623',
    'hostUin': 0,
    'format': 'jsonp',
    'inCharset': 'utf8',
    'outCharset': 'utf-8',
    'notice': 0,
    'platform': 'yqq',
    'needNewCode': 0
  })

  return jsonp(url, data, options)
}
