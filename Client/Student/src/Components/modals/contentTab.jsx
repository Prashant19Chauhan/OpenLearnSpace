import React, { useState, useEffect } from "react";
import api from "../../Api/Api";

const API_URL = "/api/student/content";

function StudentContentTab({subjectId}) {
  const [syllabus, setSyllabus] = useState([]);
  const [completedItems, setCompletedItems] = useState({});

  const fetchSyllabusData = async () => {
    try {
      const response = await api.get(API_URL, {
        params: { subjectId }
      });
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

  const toggleComplete = async (resourceId, status) => {
    try {
      await api.post(`${API_URL}/mark-complete`, {
        resourceId,
        completed: status,
      });

      setCompletedItems((prev) => ({
        ...prev,
        [resourceId]: status,
      }));
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Course Content
        </h1>
      </div>

      <div className="space-y-4">
        {syllabus.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-500">
            No content available yet
          </div>
        )}

        {syllabus.map((s) => (
          <details
            key={s.syllabusId}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 list-none transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-blue-600 group-open:rotate-90 transition-transform">
                  ▶
                </span>
                <h2 className="font-bold text-lg text-gray-800">
                  {s.syllabusName}
                </h2>
              </div>
            </summary>

            <div className="p-4 pt-0 border-t border-gray-100">
              {s.chapters?.map((c) => (
                <details
                  key={c.chapterId}
                  className="mt-3 ml-4 group/chapter border-l-2 border-emerald-200 pl-4"
                >
                  <summary className="flex justify-between items-center py-2 cursor-pointer list-none hover:text-emerald-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs group-open/chapter:rotate-90 transition-transform">
                        ▶
                      </span>
                      <h3 className="font-semibold text-gray-700">
                        {c.chapterName}
                      </h3>
                    </div>
                  </summary>

                  <div className="pb-2">
                    {c.topics?.map((t) => (
                      <details
                        key={t.topicId}
                        className="mt-2 ml-4 group/topic border-l-2 border-indigo-100 pl-4"
                      >
                        <summary className="py-1 cursor-pointer list-none">
                          <p className="text-gray-600 font-medium text-sm">
                            {t.topicName}
                          </p>
                        </summary>

                        <div className="space-y-3 mt-2 ml-4">
                          {t.subTopics?.map((sub) => (
                            <div
                              key={sub.subTopicId}
                              className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                            >
                              <h4 className="font-bold text-gray-700 text-sm mb-2">
                                {sub.subTopicName}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {sub.videos?.map((v) => (
                                  <div
                                    key={v.resourceId}
                                    className="flex flex-col gap-2 bg-blue-50 p-2 rounded"
                                  >
                                    <a
                                      href={v.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 text-xs text-blue-700"
                                    >
                                      🎬 {v.title || "Video"}
                                    </a>

                                    <button
                                      onClick={() =>
                                        toggleComplete(
                                          v.resourceId,
                                          !completedItems[v.resourceId]
                                        )
                                      }
                                      className={`text-xs px-2 py-1 rounded font-medium ${
                                        completedItems[v.resourceId]
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {completedItems[v.resourceId]
                                        ? "✓ Completed"
                                        : "Mark as Done"}
                                    </button>
                                  </div>
                                ))}

                                {sub.notes?.map((n) => (
                                  <div
                                    key={n.resourceId}
                                    className="flex flex-col gap-2 bg-gray-100 p-2 rounded"
                                  >
                                    <a
                                      href={n.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 text-xs text-gray-700"
                                    >
                                      📄 {n.title || "Notes"}
                                    </a>

                                    <button
                                      onClick={() =>
                                        toggleComplete(
                                          n.resourceId,
                                          !completedItems[n.resourceId]
                                        )
                                      }
                                      className={`text-xs px-2 py-1 rounded font-medium ${
                                        completedItems[n.resourceId]
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {completedItems[n.resourceId]
                                        ? "✓ Completed"
                                        : "Mark as Done"}
                                    </button>
                                  </div>
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

export default StudentContentTab;