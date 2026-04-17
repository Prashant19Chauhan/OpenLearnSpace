import api from "./Api"; // Assuming this is your configured Axios instance

const API_URL = "/api/teacher/content"; // Adjusted base URL to match your provided snippet

export const fetchAllSyllabus = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const createSyllabus = async (subjectId, syllabusName) => {
  const response = await api.post(`${API_URL}/syllabus`, { subjectId, syllabusName });
  return response.data;
};

export const createChapter = async (syllabusId, chapterName) => {
  const response = await api.post(`${API_URL}/chapter`, { syllabusId, chapterName });
  return response.data;
};

export const createTopic = async (syllabusId, chapterId, topicName) => {
  const response = await api.post(`${API_URL}/topic`, { syllabusId, chapterId, topicName });
  return response.data;
};

export const createSubTopic = async (syllabusId, chapterId, topicId, subTopicName) => {
  const response = await api.post(`${API_URL}/subtopic`, { syllabusId, chapterId, topicId, subTopicName });
  return response.data;
};

export const createResource = async (payload) => {
  const response = await api.post(`${API_URL}/resource`, payload);
  return response.data;
};