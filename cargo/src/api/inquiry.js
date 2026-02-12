import axios from 'axios';

export const getInquiryList = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/inquiries/admin/all`,{
        headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
}

export const inquiryResponse = async (id, reply) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`http://localhost:8080/api/inquiries/admin/${id}/answer`,reply
    ,{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain'
    },
  })
  return response.data; 
}

