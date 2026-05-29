import { httpGet } from './request'

// TODO add Notice

const GITHUB_OWNER = 'imunco'
const GITHUB_REPO = 'melody-workshop'
const FILE_PATH = 'publish/version.json'

const address = [
  [`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/master/${FILE_PATH}`, 'direct'],
  [`https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}/${FILE_PATH}`, 'direct'],
  [`https://fastly.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}/${FILE_PATH}`, 'direct'],
  [`https://gcore.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}/${FILE_PATH}`, 'direct'],
  [`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${FILE_PATH}`, 'direct'],
]

const request = async(url, retryNum = 0) => {
  return new Promise((resolve, reject) => {
    httpGet(url, {
      timeout: 10000,
    }, (err, resp, body) => {
      if (err || resp.statusCode != 200) {
        ++retryNum >= 3
          ? reject(err || new Error(resp.statusMessage || resp.statusCode))
          : request(url, retryNum).then(resolve).catch(reject)
      } else resolve(body)
    })
  })
}

const getDirectInfo = async(url) => {
  return request(url).then(info => {
    if (info.version == null) throw new Error('failed')
    return info
  })
}

const getNpmPkgInfo = async(url) => {
  return request(url).then(json => {
    if (!json.versionInfo) throw new Error('failed')
    const info = JSON.parse(json.versionInfo)
    if (info.version == null) throw new Error('failed')
    return info
  })
}

export const getVersionInfo = async(index = 0) => {
  const [url, source] = address[index]
  let promise
  switch (source) {
    case 'direct':
      promise = getDirectInfo(url)
      break
    case 'npm':
      promise = getNpmPkgInfo(url)
      break
  }

  return promise.catch(async(err) => {
    index++
    if (index >= address.length) throw err
    return getVersionInfo(index)
  })
}

// getVersionInfo().then(info => {
//   console.log(info)
// })
