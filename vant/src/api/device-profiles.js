import { get, post, put, _delete } from '@/utils/axios'

export const getDProfilesList = (data) => {
  return get('api/device-profiles', data)
}

export const addDProfile = (data) => {
  return post('api/device-profiles', data)
}

export const updateDProfile = (data) => {
  return put('api/device-profiles/' + data.id, data)
}

export const deleteDProfile = (data) => {
  return _delete('api/device-profiles/' + data.id)
}
