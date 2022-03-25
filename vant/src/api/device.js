import { get, post, put, _delete } from '@/utils/axios'

export const getDeviceList = (data) => {
  return get('api/devices', data)
}

export const getDeviceLog = (data) => {
  return get('api/devices-log', data)
}

export const addDevice = (data) => {
  return post('api/devices', data)
}

export const updateDevice = (data) => {
  return put('api/devices/' + data.id, data)
}

export const deleteDevice = (data) => {
  return _delete('api/devices/' + data.id)
}
