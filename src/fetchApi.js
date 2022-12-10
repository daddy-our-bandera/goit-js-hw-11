import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31928578-c01e00a5ffcaa51fc02f8762c';

export const fetchApi = async (input, page = "1") => {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${input}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`)
  return response.data
  
};