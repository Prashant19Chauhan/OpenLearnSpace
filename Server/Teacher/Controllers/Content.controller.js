import ContentModel from "../../Institute/Academic/Models/content.model.js";
import StudentContentModel from "../../aiMentor/models/StudentContent.model.js";
import { v4 as uuidv4 } from "uuid";

// POST /api/content/syllabus
// Body: { subjectId, syllabusName }
export const CreateSyllabus = async (req, res, next) => {
  try {
    const { subjectId, syllabusName, students} = req.body;

    if (!subjectId || !syllabusName) {
      return res.status(400).json({
        success: false,
        message: "subjectId and syllabusName are required",
      });
    }

    const syllabusId = uuidv4();

    const syllabus = await ContentModel.create({
      subjectId,
      syllabusId,
      syllabusName,
      chapters: [],
    });

    for (const student of students) {
      await StudentContentModel.create({
        studentId: student.studentId,
        subjectId,
        syllabusId,
        syllabusName,
        level: "Beginner",
        score: 0,
        chapters: [],
      });
    }

    res.status(201).json({
      success: true,
      message: "Syllabus created successfully",
      data: syllabus,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/content/chapter
// Body: { syllabusId, chapterName }

export const createChapters = async (req, res, next) => {
  try {
    const { syllabusId, chapterName, students } = req.body;

    if (!syllabusId || !chapterName) {
      return res.status(400).json({
        success: false,
        message: "syllabusId and chapterName are required",
      });
    }

    const syllabus = await ContentModel.findOne({ syllabusId });

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    const chapterId = uuidv4();

    const chapterData = {
      chapterId,
      chapterName,
      topics: [],
    };

    // Add to Master Content
    syllabus.chapters.push(chapterData);
    await syllabus.save();

    // Add Chapter to Each Student
    if (students && students.length > 0) {
      await Promise.all(
        students.map((student) =>
          StudentContentModel.updateOne(
            {
              studentId: student.studentId,
              syllabusId,
            },
            {
              $push: {
                chapters: {
                  ...chapterData,
                  level: "Beginner",
                  score: 0,
                  topics: [],
                },
              },
            }
          )
        )
      );
    }

    res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: chapterData,
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/content/topic
// Body: { syllabusId, chapterId, topicName }
export const createTopics = async (req, res, next) => {
  try {
    const { syllabusId, chapterId, topicName } = req.body;

    if (!syllabusId || !chapterId || !topicName) {
      return res.status(400).json({
        success: false,
        message: "syllabusId, chapterId, and topicName are required",
      });
    }

    const syllabus = await ContentModel.findOne({ syllabusId });

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    const chapter = syllabus.chapters.find(
      (c) => c.chapterId === chapterId
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const topicId = uuidv4();

    const topicData = {
      topicId,
      topicName,
      chapterId,
      subTopics: [],
      videos: [],
      notes: [],
    };

    // Add to Master Content
    chapter.topics.push(topicData);

    await syllabus.save();

    // Add Topic to All Students
    await StudentContentModel.updateMany(
      {
        syllabusId,
      },
      {
        $push: {
          "chapters.$[chapter].topics": {
            ...topicData,
            level: "Beginner",
            score: 0,
            subTopics: [],
          },
        },
      },
      {
        arrayFilters: [{ "chapter.chapterId": chapterId }],
      }
    );

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: topicData,
    });

  } catch (error) {
    next(error);
  }
};
// POST /api/content/subtopic
// Body: { syllabusId, chapterId, topicId, subTopicName }
export const createSubTopics = async (req, res, next) => {
  try {
    const { syllabusId, chapterId, topicId, subTopicName } = req.body;

    if (!syllabusId || !chapterId || !topicId || !subTopicName) {
      return res.status(400).json({
        success: false,
        message:
          "syllabusId, chapterId, topicId, and subTopicName are required",
      });
    }

    const syllabus = await ContentModel.findOne({ syllabusId });

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    const chapter = syllabus.chapters.find(
      (c) => c.chapterId === chapterId
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const topic = chapter.topics.find(
      (t) => t.topicId === topicId
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const subTopicId = uuidv4();

    const subTopicData = {
      subTopicId,
      subTopicName,
      chapterId,
      topicId,
      videos: [],
      notes: [],
    };

    // Add to Master Content
    topic.subTopics.push(subTopicData);

    await syllabus.save();

    // Add to All Students
    await StudentContentModel.updateMany(
      {
        syllabusId,
      },
      {
        $push: {
          "chapters.$[chapter].topics.$[topic].subTopics": {
            ...subTopicData,
            understanding: "Not Started",
            score: 0,
            level: "Beginner",
            videos: [],
            notes: [],
          },
        },
      },
      {
        arrayFilters: [
          { "chapter.chapterId": chapterId },
          { "topic.topicId": topicId },
        ],
      }
    );

    res.status(201).json({
      success: true,
      message: "SubTopic created successfully",
      data: subTopicData,
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/content/resource
// Body: { syllabusId, type: "video"|"note", level: "chapter"|"topic"|"subtopic",
//         chapterId, topicId?, subTopicId?, url, title? }
export const createNotesVideo = async (req, res, next) => {
  try {
    const {
      syllabusId,
      type,
      level,
      chapterId,
      topicId,
      subTopicId,
      url,
      title
    } = req.body;

    if (!syllabusId || !type || !level || !chapterId || !url) {
      return res.status(400).json({
        success: false,
        message: "syllabusId, type, level, chapterId, and url are required",
      });
    }

    if (!["video", "note"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be 'video' or 'note'",
      });
    }

    if (!["chapter", "topic", "subtopic"].includes(level)) {
      return res.status(400).json({
        success: false,
        message: "level must be 'chapter', 'topic', or 'subtopic'",
      });
    }

    const syllabus = await ContentModel.findOne({ syllabusId });

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found"
      });
    }

    const chapter = syllabus.chapters.find(
      (c) => c.chapterId === chapterId
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    const resource = {
      resourceId: uuidv4(),
      url,
      title: title || ""
    };

    const field = type === "video" ? "videos" : "notes";

    // ================= MASTER CONTENT =================

    if (level === "chapter") {
      chapter[field].push(resource);
    }

    else if (level === "topic") {

      if (!topicId) {
        return res.status(400).json({
          success: false,
          message: "topicId required"
        });
      }

      const topic = chapter.topics.find(
        (t) => t.topicId === topicId
      );

      topic[field].push(resource);
    }

    else if (level === "subtopic") {

      if (!topicId || !subTopicId) {
        return res.status(400).json({
          success: false,
          message: "topicId and subTopicId required"
        });
      }

      const topic = chapter.topics.find(
        (t) => t.topicId === topicId
      );

      const subTopic = topic.subTopics.find(
        (s) => s.subTopicId === subTopicId
      );

      subTopic[field].push(resource);
    }

    await syllabus.save();


    // ================= STUDENT CONTENT =================

    // CHAPTER LEVEL
    if (level === "chapter") {

      await StudentContentModel.updateMany(
        { syllabusId },
        {
          $push: {
            [`chapters.$[chapter].${field}`]: {
              ...resource,
              completed: false,
              understanding: "Not Started"
            }
          }
        },
        {
          arrayFilters: [
            { "chapter.chapterId": chapterId }
          ]
        }
      );

    }


    // TOPIC LEVEL
    else if (level === "topic") {

      await StudentContentModel.updateMany(
        { syllabusId },
        {
          $push: {
            [`chapters.$[chapter].topics.$[topic].${field}`]: {
              ...resource,
              completed: false,
              understanding: "Not Started"
            }
          }
        },
        {
          arrayFilters: [
            { "chapter.chapterId": chapterId },
            { "topic.topicId": topicId }
          ]
        }
      );

    }


    // SUBTOPIC LEVEL
    else if (level === "subtopic") {

      await StudentContentModel.updateMany(
        { syllabusId },
        {
          $push: {
            [`chapters.$[chapter].topics.$[topic].subTopics.$[sub].${field}`]: {
              ...resource,
              completed: false,
              understandingLevel: "Not Started"
            }
          }
        },
        {
          arrayFilters: [
            { "chapter.chapterId": chapterId },
            { "topic.topicId": topicId },
            { "sub.subTopicId": subTopicId }
          ]
        }
      );

    }


    res.status(201).json({
      success: true,
      message: `${type === "video" ? "Video" : "Note"} added successfully`,
      data: resource
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/content?syllabusId=...  or  GET /api/content  (all)
export const getAllData = async (req, res, next) => {
  try {
    const { syllabusId, subjectId } = req.query;

    const filter = {};
    if (syllabusId) filter.syllabusId = syllabusId;
    if (subjectId) filter.subjectId = subjectId;

    const data = await ContentModel.find(filter).lean();

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "No content found",
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};