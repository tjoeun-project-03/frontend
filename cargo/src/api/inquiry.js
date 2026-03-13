import axios from 'axios';

export const getInquiryList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://52.204.62.127:8080/api/inquiries/admin/all`,{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}

export const inquiryResponse = async (id, reply) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`http://52.204.62.127:8080/api/inquiries/admin/${id}/answer`,reply
    ,{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain'
    },
  })
  return response.data; 
}

