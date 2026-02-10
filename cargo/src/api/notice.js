import axios from 'axios';

export const noticeList = async () => {
    const response = await axios.get('http://localhost:8080/api/notices');
    return response.data;
}