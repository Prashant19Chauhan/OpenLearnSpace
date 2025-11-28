import React, { useState } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Link,
  Download,
  Edit2,
  Trash2,
} from 'lucide-react';

// Mock data
const mockChapters = [
  {
    id: '1',
    title: 'Introduction to Data Structures',
    description: 'Basic concepts and overview of data structures',
    order: 1,
    isCompleted: true,
    topics: [
      {
        id: '1-1',
        title: 'What are Data Structures?',
        description: 'Definition and importance of data structures',
        order: 1,
        isCompleted: true,
        subtopics: [
          {
            id: '1-1-1',
            title: 'Types of Data Structures',
            description: 'Linear and non-linear data structures',
            order: 1,
            isCompleted: true,
            resources: [
              {
                id: 'r1',
                title: 'Data Structures Overview.pdf',
                type: 'pdf',
                url: '/resources/ds-overview.pdf',
                uploadDate: '2024-12-15',
                size: '2.5 MB',
              },
            ],
          },
        ],
        resources: [
          {
            id: 'r2',
            title: 'Introduction Video Lecture',
            type: 'video',
            url: '/videos/intro-ds.mp4',
            uploadDate: '2024-12-14',
            size: '125 MB',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Arrays and Strings',
    description: 'Working with arrays and string data structures',
    order: 2,
    isCompleted: false,
    topics: [
      {
        id: '2-1',
        title: 'Array Operations',
        description: 'Insert, delete, search operations on arrays',
        order: 1,
        isCompleted: false,
        subtopics: [],
        resources: [],
      },
    ],
  },
];

const ContentManagement = ({ subjectId }) => {
  const [chapters] = useState(mockChapters);
  const [expandedChapters, setExpandedChapters] = useState(new Set(['1']));
  const [expandedTopics, setExpandedTopics] = useState(new Set(['1-1']));
  const [showAddChapter, setShowAddChapter] = useState(false);

  const toggleChapter = (chapterId) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleTopic = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500" />;
      case 'link':
        return <Link className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Content Management
          </h2>
          <p className="text-gray-600 mt-1">
            Structure and organize course content
          </p>
        </div>
        <button
          onClick={() => setShowAddChapter(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter</span>
        </button>
      </div>

      {/* Content Tree */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="border border-gray-200 rounded-lg"
              >
                {/* Chapter Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleChapter(chapter.id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedChapters.has(chapter.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div
                      className={`w-3 h-3 rounded-full ${chapter.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Chapter Content */}
                {expandedChapters.has(chapter.id) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4 space-y-3">
                      {chapter.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="bg-white rounded-lg border border-gray-200"
                        >
                          {/* Topic Header */}
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleTopic(topic.id)}
                          >
                            <div className="flex items-center space-x-3">
                              {expandedTopics.has(topic.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                              <div
                                className={`w-2 h-2 rounded-full ${topic.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {topic.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Edit2 className="w-3 h-3 text-gray-400" />
                              </button>
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Plus className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {/* Topic Content */}
                          {expandedTopics.has(topic.id) && (
                            <div className="border-t border-gray-200 bg-gray-50 p-3">
                              {/* Subtopics */}
                              {topic.subtopics.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="font-medium text-gray-700 mb-2">
                                    Subtopics
                                  </h5>
                                  <div className="space-y-2">
                                    {topic.subtopics.map((subtopic) => (
                                      <div
                                        key={subtopic.id}
                                        className="bg-white rounded-md border border-gray-200 p-3"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <div
                                              className={`w-1.5 h-1.5 rounded-full ${subtopic.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                              {subtopic.title}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                              <Edit2 className="w-3 h-3 text-gray-400" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                              <Plus className="w-3 h-3 text-gray-400" />
                                            </button>
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {subtopic.description}
                                        </p>

                                        {/* Subtopic Resources */}
                                        {subtopic.resources.length > 0 && (
                                          <div className="mt-3 space-y-1">
                                            {subtopic.resources.map(
                                              (resource) => (
                                                <div
                                                  key={resource.id}
                                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                >
                                                  <div className="flex items-center space-x-2">
                                                    {getResourceIcon(
                                                      resource.type
                                                    )}
                                                    <span className="text-xs text-gray-700">
                                                      {resource.title}
                                                    </span>
                                                    {resource.size && (
                                                      <span className="text-xs text-gray-500">
                                                        ({resource.size})
                                                      </span>
                                                    )}
                                                  </div>
                                                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                                    <Download className="w-3 h-3 text-gray-400" />
                                                  </button>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Topic Resources */}
                              {topic.resources.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-700 mb-2">
                                    Resources
                                  </h5>
                                  <div className="space-y-2">
                                    {topic.resources.map((resource) => (
                                      <div
                                        key={resource.id}
                                        className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200"
                                      >
                                        <div className="flex items-center space-x-3">
                                          {getResourceIcon(resource.type)}
                                          <div>
                                            <span className="text-sm font-medium text-gray-900">
                                              {resource.title}
                                            </span>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <span className="text-xs text-gray-500">
                                                {new Date(
                                                  resource.uploadDate
                                                ).toLocaleDateString()}
                                              </span>
                                              {resource.size && (
                                                <>
                                                  <span className="text-xs text-gray-400">
                                                    •
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    {resource.size}
                                                  </span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                            <Download className="w-4 h-4 text-gray-400" />
                                          </button>
                                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                            <Edit2 className="w-4 h-4 text-gray-400" />
                                          </button>
                                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                            <Trash2 className="w-4 h-4 text-gray-400" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Add Resource Button */}
                              <button className="mt-3 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                                <Plus className="w-4 h-4" />
                                <span>Add Resource</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Topic Button */}
                      <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                        <div className="flex items-center justify-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Topic</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Chapter Button */}
          {showAddChapter && (
            <div className="mt-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Chapter title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  placeholder="Chapter description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Add Chapter
                  </button>
                  <button
                    onClick={() => setShowAddChapter(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
