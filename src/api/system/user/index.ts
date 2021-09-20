import { request } from '@/utils/request'
import Api from '@/core/permission/modules/sys/user'
import { generatePermCode } from '@/core/permission'

export function getUserListPage(data: API.PageParams<{ departmentIds: number[] }>) {
  return request<API.TableListResult<API.UserListPageResult>>(
    {
      url: Api.page,
      method: 'post',
      data
    },
    {
      permCode: generatePermCode(Api.page)
    }
  )
}

export function createUser(data: API.CreateUserParams) {
  return request(
    {
      url: Api.add,
      method: 'post',
      data
    },
    {
      permCode: generatePermCode(Api.add)
    }
  )
}

export function getUserInfo(query: { userId: number }) {
  return request<API.AdminUserInfo>(
    {
      url: Api.info,
      method: 'get',
      params: query
    },
    {
      permCode: generatePermCode(Api.info)
    }
  )
}

export function updateUser(data: API.UpdateAdminInfoParams) {
  return request(
    {
      url: Api.update,
      method: 'post',
      data
    },
    {
      permCode: generatePermCode(Api.update)
    }
  )
}

export function updateUserPassword(data: API.UpdateAdminUserPassword) {
  return request(
    {
      url: Api.password,
      method: 'post',
      data
    },
    {
      permCode: generatePermCode(Api.password)
    }
  )
}

export function deleteUsers(data: { userIds: number[] }) {
  return request(
    {
      url: Api.delete,
      method: 'post',
      data
    },
    {
      permCode: generatePermCode(Api.delete)
    }
  )
}
