import { get, post, put, _delete } from '@/utils/axios'

export const getBtsList = (data) => {
  return get('api/bts', data)
}

export const getBtsDetial = (data) => {
  return get('api/bts/' + data.id, data)
}

export const addBts = (data) => {
  return post('api/bts', data)
}

export const updateBts = (data) => {
  return put('api/bts/' + data.id, data)
}

export const deleteBts = (data) => {
  return _delete('api/bts/' + data.id)
}
