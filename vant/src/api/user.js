import { get, post, put, _delete } from '@/utils/axios'

export const getUserList = (data) => {
  return get('api/users', data)
}

export const getUserDetial = (data) => {
  return get('api/users/' + data.id, data)
}

export const addUser = (data) => {
  return post('api/users', data)
}

export const updateUser = (data) => {
  return put('api/users/' + data.id, data)
}

export const deleteUser = (data) => {
  return _delete('api/users/' + data.id)
}
