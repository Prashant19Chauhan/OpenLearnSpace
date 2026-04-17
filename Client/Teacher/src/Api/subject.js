import api from "./Api";

const API_URL = '/api/teacher/program';

export const getsubejcts = async() => {
    try{
        const response = await api.get(`${API_URL}/subjects/teachers`);
        console.log(response)
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const getBatchStudents = async(batchId) => {
    try{ 
        const response = await api.get(`${API_URL}/${batchId}/students`);
        return response.data;
    }
    catch(error){
        console.log(error)
    }
}

export const addAssignment = async (data) => {
    try {

        const response = await api.post(
            `${API_URL}/assignment`,
            data
        );

        return response.data;

    } catch (error) {
        console.log(error);
    }
};


// =============================
// Get Assignments
// =============================
export const getAssignments = async (batchId) => {
    try {

        const response = await api.get(
            `${API_URL}/${batchId}/assignments`
        );

        return response.data;

    } catch (error) {
        console.log(error);
    }
};


// =============================
// Update Student Report
// =============================
export const updateStudentReport = async (data) => {
    try {

        const response = await api.put(
            `${API_URL}/assignment/report`,
            data
        );

        return response.data;

    } catch (error) {
        console.log(error);
    }
};


// =============================
// Get Assignment Report
// =============================
export const getAssignmentReport = async (assignmentId) => {
    try {

        const response = await api.get(
            `${API_URL}/assignment/${assignmentId}/report`
        );

        return response.data;

    } catch (error) {
        console.log(error);
    }
};

export const getContent = async () => {

};

// Save Content
export const saveContent = async (payload) => {
    console.log(payload)
};