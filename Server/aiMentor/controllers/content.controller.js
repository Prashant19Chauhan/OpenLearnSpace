import axios from "axios";
import StudentContentModel from "../models/StudentContent.model.js";
import { v4 as uuidv4 } from "uuid";

// Helper function to call AI API for content generation
const generateAIContent = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an intelligent AI tutor. You always respond with valid JSON only, no markdown formatting, no explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Debug log
    console.log("API Response:", JSON.stringify(response.data, null, 2));

    // Groq/OpenAI format: response.data.choices[0].message.content
    if (!response.data?.choices?.[0]?.message?.content) {
      console.error("Unexpected API response structure:", response.data);
      throw new Error("Invalid API response structure");
    }

    const textContent = response.data.choices[0].message.content;

    // Clean up any markdown code blocks
    const cleanedText = textContent.replace(/```json\n?|\n?```/g, "").trim();

    console.log("Cleaned AI Response:", cleanedText);

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Generation Error Details:");
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Message:", error.message);
    
    if (error.response?.data) {
      throw new Error(
        `AI API Error: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`
      );
    }
    throw new Error(`Failed to generate content with AI: ${error.message}`);
  }
};

// Generate chapters with topics, subtopics, and resources
const generateChapters = async (syllabusContext, studentContext) => {
  const prompt = `Based on the following syllabus and student context, generate a structured curriculum.

Syllabus: ${JSON.stringify(syllabusContext)}
Student Context: ${JSON.stringify(studentContext)}

Generate 3 NEW chapters, each with 2 topics, each topic with 2 subtopics. For each subtopic, suggest 2 video resources and 2 note resources with realistic titles and URLs (use placeholder URLs like https://example.com/video/...).

IMPORTANT: Generate completely NEW content. Use unique random IDs for all chapters, topics, subtopics, and resources.

Return a JSON object with a "chapters" array containing the curriculum structure. Use UUIDs or timestamp-based IDs to ensure uniqueness.

Example structure:
{
  "chapters": [
    {
      "chapterId": "ch-${Date.now()}-1",
      "chapterName": "Introduction to the Subject",
      "level": "beginner",
      "score": 0,
      "topics": [
        {
          "topicId": "tp-${Date.now()}-1-1",
          "topicName": "Basic Concepts",
          "chapterId": "ch-${Date.now()}-1",
          "level": "beginner",
          "score": 0,
          "subTopics": [
            {
              "subTopicId": "st-${Date.now()}-1-1-1",
              "subTopicName": "Fundamental Principles",
              "chapterId": "ch-${Date.now()}-1",
              "topicId": "tp-${Date.now()}-1-1",
              "level": "beginner",
              "score": 0,
              "videos": [
                {
                  "resourceId": "vid-${Date.now()}-1",
                  "url": "https://example.com/video/intro-basics",
                  "title": "Introduction to Basic Concepts",
                  "understandingLevel": "beginner",
                  "completed": false
                },
                {
                  "resourceId": "vid-${Date.now()}-2",
                  "url": "https://example.com/video/fundamentals",
                  "title": "Understanding Fundamentals",
                  "understandingLevel": "beginner",
                  "completed": false
                }
              ],
              "notes": [
                {
                  "resourceId": "note-${Date.now()}-1",
                  "url": "https://example.com/notes/basics-guide",
                  "title": "Beginner's Guide to Basics",
                  "understandingLevel": "beginner",
                  "completed": false
                },
                {
                  "resourceId": "note-${Date.now()}-2",
                  "url": "https://example.com/notes/fundamentals-summary",
                  "title": "Fundamentals Summary",
                  "understandingLevel": "beginner",
                  "completed": false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;

  const result = await generateAIContent(prompt);
  return result.chapters || result;
};

// Generate topics for a specific chapter
const generateTopics = async (chapterContext, studentContext) => {
  const prompt = `Based on the following chapter and student context, generate NEW topics.

Chapter: ${JSON.stringify(chapterContext)}
Student Context: ${JSON.stringify(studentContext)}

Generate 2-3 NEW topics for this chapter, each with 2 subtopics. For each subtopic, suggest 2 video resources and 2 note resources.

IMPORTANT: Generate completely NEW content different from existing topics. Use unique random IDs.

Return a JSON object with a "topics" array. Use the provided chapterId: ${chapterContext?.chapterId || 'unknown'}

Example structure:
{
  "topics": [
    {
      "topicId": "tp-${Date.now()}-new-1",
      "topicName": "New Topic Name",
      "chapterId": "${chapterContext?.chapterId || 'unknown'}",
      "level": "beginner",
      "score": 0,
      "subTopics": [
        {
          "subTopicId": "st-${Date.now()}-new-1-1",
          "subTopicName": "New SubTopic Name",
          "chapterId": "${chapterContext?.chapterId || 'unknown'}",
          "topicId": "tp-${Date.now()}-new-1",
          "level": "beginner",
          "score": 0,
          "videos": [
            {
              "resourceId": "vid-${Date.now()}-new-1",
              "url": "https://example.com/video/new-topic1",
              "title": "New Video Title",
              "understandingLevel": "beginner",
              "completed": false
            }
          ],
          "notes": [
            {
              "resourceId": "note-${Date.now()}-new-1",
              "url": "https://example.com/notes/new-topic1",
              "title": "New Notes Title",
              "understandingLevel": "beginner",
              "completed": false
            }
          ]
        }
      ]
    }
  ]
}`;

  const result = await generateAIContent(prompt);
  return result.topics || result;
};

// Generate subtopics for a specific topic
const generateSubTopics = async (topicContext, studentContext) => {
  const prompt = `Based on the following topic and student context, generate NEW subtopics.

Topic: ${JSON.stringify(topicContext)}
Student Context: ${JSON.stringify(studentContext)}

Generate 2-3 NEW subtopics for this topic. For each subtopic, suggest 2 video resources and 2 note resources.

IMPORTANT: Generate completely NEW content different from existing subtopics. Use unique random IDs.

Return a JSON object with a "subTopics" array. Use the provided chapterId: ${topicContext?.chapterId || 'unknown'} and topicId: ${topicContext?.topicId || 'unknown'}

Example structure:
{
  "subTopics": [
    {
      "subTopicId": "st-${Date.now()}-new-1",
      "subTopicName": "New SubTopic Name",
      "chapterId": "${topicContext?.chapterId || 'unknown'}",
      "topicId": "${topicContext?.topicId || 'unknown'}",
      "level": "beginner",
      "score": 0,
      "videos": [
        {
          "resourceId": "vid-${Date.now()}-new-1",
          "url": "https://example.com/video/new-subtopic1",
          "title": "New Video Title",
          "understandingLevel": "beginner",
          "completed": false
        }
      ],
      "notes": [
        {
          "resourceId": "note-${Date.now()}-new-1",
          "url": "https://example.com/notes/new-subtopic1",
          "title": "New Notes Title",
          "understandingLevel": "beginner",
          "completed": false
        }
      ]
    }
  ]
}`;

  const result = await generateAIContent(prompt);
  return result.subTopics || result;
};

// Generate only resources (videos and notes) for a subtopic
const generateResources = async (subTopicContext, studentContext) => {
  const prompt = `Based on the following subtopic and student context, generate NEW learning resources.

SubTopic: ${JSON.stringify(subTopicContext)}
Student Context: ${JSON.stringify(studentContext)}

Generate 2 NEW video resources and 2 NEW note resources for this subtopic.

IMPORTANT: Generate completely NEW resources. Use unique random IDs.

Return a JSON object with "videos" and "notes" arrays:
{
  "videos": [
    {
      "resourceId": "vid-${Date.now()}-new-1",
      "url": "https://example.com/video/new-resource1",
      "title": "New Comprehensive Video Tutorial",
      "understandingLevel": "beginner",
      "completed": false
    },
    {
      "resourceId": "vid-${Date.now()}-new-2",
      "url": "https://example.com/video/new-resource2",
      "title": "New Advanced Concepts Explained",
      "understandingLevel": "intermediate",
      "completed": false
    }
  ],
  "notes": [
    {
      "resourceId": "note-${Date.now()}-new-1",
      "url": "https://example.com/notes/new-resource1",
      "title": "New Study Guide",
      "understandingLevel": "beginner",
      "completed": false
    },
    {
      "resourceId": "note-${Date.now()}-new-2",
      "url": "https://example.com/notes/new-resource2",
      "title": "New Practice Problems",
      "understandingLevel": "intermediate",
      "completed": false
    }
  ]
}`;

  return await generateAIContent(prompt);
};

export const createContent = async (req, res, next) => {
  try {
    const { studentId, subjectId, syllabusId, levelInfo, studentContext } =
      req.body;

    // Validate required fields
    if (!studentId || !subjectId || !syllabusId || !levelInfo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // -----------------------------
    // Extract hierarchy safely
    // -----------------------------
    const chapterContext = studentContext?.chapters?.[0];
    const topicContext = chapterContext?.topics?.[0];
    const subTopicContext = topicContext?.subTopics?.[0];

    // -----------------------------
    // Detect Last Level
    // -----------------------------
    const { chapterId, topicId, subTopicId } = levelInfo;

    let generatedContent = {};

    // Check if document already exists
    let existingContent = await StudentContentModel.findOne({
      studentId,
      subjectId,
      syllabusId,
    });

    if (!existingContent) {
      // Create new document
      existingContent = new StudentContentModel({
        studentId,
        subjectId,
        syllabusId,
        syllabusName: studentContext?.syllabusName || "Syllabus",
        level: studentContext?.level || "beginner",
        score: studentContext?.score || 0,
        chapters: [],
      });
    }

    // -----------------------------
    // Level 1: No chapterId - Generate everything and APPEND
    // -----------------------------
    if (!chapterId) {
      console.log("Generating chapters, topics, subtopics, videos, and notes...");
      
      const newChapters = await generateChapters(
        { syllabusId, syllabusName: studentContext?.syllabusName },
        studentContext
      );

      // APPEND new chapters to existing ones
      existingContent.chapters = [...existingContent.chapters, ...newChapters];
      generatedContent = { chapters: newChapters };
    }
    // -----------------------------
    // Level 2: Has chapterId, no topicId - Generate from topics and APPEND
    // -----------------------------
    else if (chapterId && !topicId) {
      console.log("Generating topics, subtopics, videos, and notes...");

      const newTopics = await generateTopics(chapterContext, studentContext);

      // Find and update the chapter
      const chapterIndex = existingContent.chapters.findIndex(
        (ch) => ch.chapterId === chapterId
      );

      if (chapterIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        });
      }

      // APPEND new topics to existing ones
      const existingTopics = existingContent.chapters[chapterIndex].topics || [];
      existingContent.chapters[chapterIndex].topics = [...existingTopics, ...newTopics];
      generatedContent = { topics: newTopics };
    }
    // -----------------------------
    // Level 3: Has topicId, no subTopicId - Generate from subtopics and APPEND
    // -----------------------------
    else if (chapterId && topicId && !subTopicId) {
      console.log("Generating subtopics, videos, and notes...");

      const newSubTopics = await generateSubTopics(topicContext, studentContext);

      // Find and update the topic
      const chapter = existingContent.chapters.find(
        (ch) => ch.chapterId === chapterId
      );
      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        });
      }

      const topicIndex = chapter.topics.findIndex((t) => t.topicId === topicId);
      if (topicIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Topic not found",
        });
      }

      // APPEND new subtopics to existing ones
      const existingSubTopics = chapter.topics[topicIndex].subTopics || [];
      chapter.topics[topicIndex].subTopics = [...existingSubTopics, ...newSubTopics];
      generatedContent = { subTopics: newSubTopics };
    }
    // -----------------------------
    // Level 4: Has subTopicId - Generate only videos and notes and APPEND
    // -----------------------------
    else if (chapterId && topicId && subTopicId) {
      console.log("Generating videos and notes only...");

      const newResources = await generateResources(subTopicContext, studentContext);

      // Find and update the subtopic
      const chapter = existingContent.chapters.find(
        (ch) => ch.chapterId === chapterId
      );
      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        });
      }

      const topic = chapter.topics.find((t) => t.topicId === topicId);
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Topic not found",
        });
      }

      const subTopicIndex = topic.subTopics.findIndex(
        (st) => st.subTopicId === subTopicId
      );
      if (subTopicIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "SubTopic not found",
        });
      }

      // APPEND new videos and notes to existing ones
      const existingVideos = topic.subTopics[subTopicIndex].videos || [];
      const existingNotes = topic.subTopics[subTopicIndex].notes || [];
      
      topic.subTopics[subTopicIndex].videos = [...existingVideos, ...newResources.videos];
      topic.subTopics[subTopicIndex].notes = [...existingNotes, ...newResources.notes];
      
      generatedContent = newResources;
    }

    // Save to database
    await existingContent.save();

    return res.status(200).json({
      success: true,
      message: "Content generated and appended successfully",
      data: generatedContent,
    });
  } catch (error) {
    console.error("Error in createContent:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};