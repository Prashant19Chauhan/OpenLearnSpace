import api from './Api';

const API_URL = '/api/institute/teacher';

export const addTeacher = async (data) => {
  try {
    const response = await api.post(`${API_URL}/hire`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const teacherList = async () => {
  try {
    const response = await api.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const teacherDetails = async (teacherId) => {
  try {
    const response = await api.get(`${API_URL}/${teacherId.id}/details`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
