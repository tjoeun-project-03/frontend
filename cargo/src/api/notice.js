import axios from 'axios';

export const getNoticeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://52.204.62.127:8080/api/notices',{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}

export const getNoticeDetail = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://52.204.62.127:8080/api/notices/${id}`,{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}

export const deleteNotice = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`http://52.204.62.127:8080/api/notices/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return response.data; 
}

export const createNotice = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://52.204.62.127:8080/api/notices`,{
    title: data.title,
    content: data.content,
    target: data.target,
    pinned: data.pinned,
    },{
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return response.data; 
}

export const updateNotice = async (data, id) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`http://52.204.62.127:8080/api/notices/${id}`,{
    title: data.title,
    content: data.content,
    target: data.target,
    pinned: data.pinned,
    },{
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  return response.data; 
}