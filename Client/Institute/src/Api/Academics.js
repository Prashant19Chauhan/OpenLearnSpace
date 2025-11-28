import api from './Api';

const API_URL = '/api/institute/program';

export const addProgram = async (data) => {
  try {
    const response = await api.post(`${API_URL}/create`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const programList = async () => {
  try {
    const response = await api.get(`${API_URL}/list`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createBatch = async (programId, newBatch) => {
  console.log(programId);
  try {
    const response = await api.post(
      `${API_URL}/${programId.id}/batch/create`,
      newBatch,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getBatchList = async (programId) => {
  try {
    const response = await api.get(`${API_URL}/${programId}/batch/list`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getBatchDetails = async (programId, batchId) => {
  try {
    const response = await api.get(`${API_URL}/${programId}/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createSubject = async (data, batchId, programId) => {
  try {
    const response = await api.post(
      `${API_URL}/${programId}/batch/${batchId}/subject/createSubject`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const subjectList = async (batchId, programId) => {
  try {
    const response = await api.get(
      `${API_URL}/${programId}/batch/${batchId}/subject/list`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
