import { client as apiClient } from '../api';

// Users

// GET Users
export const getUsers = async ({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/users')
    return response.data
}
// GET User
export const getUser = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/users/' + params.userId)
    return response.data
}
// Delete User
export const delUser = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.delete('/users/' + params.userId)
    return response.data
}

// Songs

// GET Songs
export const getSongs = async ({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/songs')
    return response.data
}
// GET Song
export const getSong = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/songs/' + params.songId)
    return response.data
}
// Delete Song
export const delSong = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.delete('/songs/' + params.songId)
    return response.data
}