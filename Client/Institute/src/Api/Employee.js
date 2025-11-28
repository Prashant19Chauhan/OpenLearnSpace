import api from './api';

const API_URL = '/api/institute/employee';

export const addStaff = async (formData) => {
  try {
    const response = await api.post(`${API_URL}/hire`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEmployee = async () => {
  try {
    const response = await api.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeDetails = async (employeeId) => {
  try {
    const response = await api.get(`${API_URL}/${employeeId.id}/details`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
