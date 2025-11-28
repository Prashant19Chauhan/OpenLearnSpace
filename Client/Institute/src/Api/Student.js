import api from './Api';

const API_URL = '/api/institute/student';

export const addStudent = async (data) => {
  try {
    const response = await api.post(`${API_URL}/enroll`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const StudentList = async () => {
  try {
    const response = await api.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const StudentDetails = async (studentId) => {
  try {
    const response = await api.get(`${API_URL}/${studentId.id}/details`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
