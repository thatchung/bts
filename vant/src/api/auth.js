import { get, post } from '@/utils/axios'

export const login = (data) => {
  return post('api/auth/local', data)
}

export const getme = (data) => {
  return get('api/users/' + data.id + '?populate[0]=role')
}
