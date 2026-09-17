import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 15000,
});

export const fetchPosts = async (page, limit, signal) => {
  const response = await api.get(`/posts?_page=${page}&_limit=${limit}`, { signal });
  return response.data;
};

export const fetchComments = async (postId, signal) => {
  const response = await api.get(`/posts/${postId}/comments`, { signal });
  return response.data;
};

export const patchPostLike = async (postId, body, signal) => {
  const response = await api.patch(`/posts/${postId}`, body, { signal });
  return response.data;
};

export default api;
