import api from "./Api";

const API_URL = '/api/student/program';

export const getsubejcts = async() => {
    try{
        const response = await api.get(`${API_URL}/batch/subjects`);
        console.log(response)
        return response.data;
    }catch(error){
        console.log(error);
    }
}

// =============================
// Get Assignments
// =============================
export const getAssignments = async (subjectId) => {
    console.log(subjectId)
    try {

        const response = await api.get(
            `${API_URL}/${subjectId}/assignments`
        );

        return response.data;

    } catch (error) {
        console.log(error);
    }
};


// =============================
// Get Assignment Report
// =============================
export const getAssignmentReport = async (assignmentId, studentId) => {
    try {

        const response = await api.get(
            `${API_URL}/assignment/${assignmentId}/report/student/${studentId}`
        );

        return response.data;

    } catch (error) {
        console.log(error);
    }
};
