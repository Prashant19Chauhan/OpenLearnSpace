import React, { useState, useEffect } from "react";
import api from "../../Api/Api";

const API_URL = "/api/teacher/content";

function ContentTab({subjectId}) {
  const [syllabus, setSyllabus] = useState([]);
  const [syllabusName, setSyllabusName] = useState("");

  const fetchSyllabusData = async () => {
    try {
      const response = await api.get(API_URL);
      if (response.data.success) {
        setSyllabus(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSyllabus([]);
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchSyllabusData();
  }, []);

  // Logic functions remain the same as your original snippet
  const addSyllabus = async () => {
    if (!syllabusName) return;;
    if (!subjectId) return;
    try {
      const response = await api.post(`${API_URL}/syllabus`, { subjectId, syllabusName });
      if (response.data.success) {
        setSyllabusName("");
        fetchSyllabusData();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create syllabus");
    }
  };

  const addChapter = async (syllabusId) => {
    const chapterName = prompt("Enter Chapter Name");
    if (chapterName) {
      await api.post(`${API_URL}/chapter`, { syllabusId, chapterName });
      fetchSyllabusData();
    }
  };

  const addTopic = async (syllabusId, chapterId) => {
    const topicName = prompt("Enter Topic Name");
    if (topicName) {
      await api.post(`${API_URL}/topic`, { syllabusId, chapterId, topicName });
      fetchSyllabusData();
    }
  };

  const addSubtopic = async (syllabusId, chapterId, topicId) => {
    const subTopicName = prompt("Enter Subtopic Name");
    if (subTopicName) {
      await api.post(`${API_URL}/subtopic`, { syllabusId, chapterId, topicId, subTopicName });
      fetchSyllabusData();
    }
  };

  const addContent = async (syllabusId, chapterId, topicId, subTopicId, type) => {
    const title = prompt(`Enter ${type === "video" ? "Video" : "Notes"} Title`);
    const url = prompt(`Enter URL`);
    if (title && url) {
      await api.post(`${API_URL}/resource`, {
        syllabusId, type, level: "subtopic", chapterId, topicId, subTopicId, url, title,
      });
      fetchSyllabusData();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header & Add Syllabus */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Content Management</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New Syllabus Name (e.g. Mathematics 101)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={syllabusName}
            onChange={(e) => setSyllabusName(e.target.value)}
          />
          <button
            onClick={addSyllabus}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-sm"
          >
            Create Syllabus
          </button>
        </div>
      </div>

      {/* Syllabus List */}
      <div className="space-y-4">
        {syllabus.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-500">
            No syllabus found. Start by creating one above.
          </div>
        )}

        {syllabus.map((s) => (
          <details key={s.syllabusId} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 list-none transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-blue-600 group-open:rotate-90 transition-transform">▶</span>
                <h2 className="font-bold text-lg text-gray-800">{s.syllabusName}</h2>
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full uppercase tracking-wider">ID: {s.subjectId}</span>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); addChapter(s.syllabusId); }}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-100 transition-colors"
              >
                + Add Chapter
              </button>
            </summary>

            <div className="p-4 pt-0 border-t border-gray-100">
              {s.chapters?.map((c) => (
                <details key={c.chapterId} className="mt-3 ml-4 group/chapter border-l-2 border-emerald-200 pl-4">
                  <summary className="flex justify-between items-center py-2 cursor-pointer list-none hover:text-emerald-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs group-open/chapter:rotate-90 transition-transform">▶</span>
                      <h3 className="font-semibold text-gray-700">{c.chapterName}</h3>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); addTopic(s.syllabusId, c.chapterId); }}
                      className="text-indigo-600 text-xs font-bold hover:underline"
                    >
                      + Add Topic
                    </button>
                  </summary>

                  <div className="pb-2">
                    {c.topics?.map((t) => (
                      <details key={t.topicId} className="mt-2 ml-4 group/topic border-l-2 border-indigo-100 pl-4">
                        <summary className="flex justify-between items-center py-1 cursor-pointer list-none">
                          <p className="text-gray-600 font-medium text-sm">{t.topicName}</p>
                          <button
                            onClick={(e) => { e.preventDefault(); addSubtopic(s.syllabusId, c.chapterId, t.topicId); }}
                            className="text-orange-600 text-[11px] font-bold hover:underline"
                          >
                            + Add Subtopic
                          </button>
                        </summary>

                        <div className="space-y-3 mt-2 ml-4">
                          {t.subTopics?.map((sub) => (
                            <div key={sub.subTopicId} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-700 text-sm">{sub.subTopicName}</h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => addContent(s.syllabusId, c.chapterId, t.topicId, sub.subTopicId, "video")}
                                    className="bg-white border border-blue-200 text-blue-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-blue-50"
                                  >
                                    + Video
                                  </button>
                                  <button
                                    onClick={() => addContent(s.syllabusId, c.chapterId, t.topicId, sub.subTopicId, "note")}
                                    className="bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-gray-100"
                                  >
                                    + Note
                                  </button>
                                </div>
                              </div>

                              {/* Resources */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {sub.videos?.map((v) => (
                                  <a key={v.resourceId} href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-blue-100/50 text-blue-700 p-2 rounded hover:bg-blue-100 transition-colors">
                                    <span className="shrink-0">🎬</span>
                                    <span className="truncate font-medium">{v.title || "Video Link"}</span>
                                  </a>
                                ))}
                                {sub.notes?.map((n) => (
                                  <a key={n.resourceId} href={n.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200 transition-colors">
                                    <span className="shrink-0">📄</span>
                                    <span className="truncate font-medium">{n.title || "Study Notes"}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default ContentTab;