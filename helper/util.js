import shajs from 'sha.js'

export function hash(str){
  return shajs('sha256').update(str).digest('hex')
}

export function randomId(){
  let str = shajs('sha1').update(Date.now()+'').digest('hex')
  return str.substr(str.length - 10)
}