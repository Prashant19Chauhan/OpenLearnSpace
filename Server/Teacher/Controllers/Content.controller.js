import ContentModel from "../../Institute/Academic/Models/content.model.js";
import { v4 as uuidv4 } from "uuid";

// POST /api/content/syllabus
// Body: { subjectId, syllabusName }
export const CreateSyllabus = async (req, res, next) => {
  try {
    const { subjectId, syllabusName } = req.body;

    if (!subjectId || !syllabusName) {
      return res.status(400).json({
        success: false,
        message: "subjectId and syllabusName are required",
      });
    }

    const existing = await ContentModel.findOne({ subjectId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Syllabus for this subjectId already exists",
      });
    }

    const syllabus = await ContentModel.create({
      subjectId,
      syllabusId: uuidv4(),
      syllabusName,
      chapters: [],
    });

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
    const { syllabusId, chapterName } = req.body;

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

    syllabus.chapters.push({
      chapterId,
      chapterName,
      topics: [],
      videos: [],
      notes: [],
    });

    await syllabus.save();

    const newChapter = syllabus.chapters.find((c) => c.chapterId === chapterId);

    res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: newChapter,
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

    const chapter = syllabus.chapters.find((c) => c.chapterId === chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const topicId = uuidv4();

    chapter.topics.push({
      topicId,
      topicName,
      chapterId,
      subTopics: [],
      videos: [],
      notes: [],
    });

    await syllabus.save();

    const newTopic = chapter.topics.find((t) => t.topicId === topicId);

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: newTopic,
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
        message: "syllabusId, chapterId, topicId, and subTopicName are required",
      });
    }

    const syllabus = await ContentModel.findOne({ syllabusId });
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    const chapter = syllabus.chapters.find((c) => c.chapterId === chapterId);
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

    const subTopicId = uuidv4();

    topic.subTopics.push({
      subTopicId,
      subTopicName,
      chapterId,
      topicId,
      videos: [],
      notes: [],
    });

    await syllabus.save();

    const newSubTopic = topic.subTopics.find((s) => s.subTopicId === subTopicId);

    res.status(201).json({
      success: true,
      message: "SubTopic created successfully",
      data: newSubTopic,
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
    const { syllabusId, type, level, chapterId, topicId, subTopicId, url, title } = req.body;

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
      return res.status(404).json({ success: false, message: "Syllabus not found" });
    }

    const chapter = syllabus.chapters.find((c) => c.chapterId === chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    const resource = { resourceId: uuidv4(), url, title: title || "" };
    const field = type === "video" ? "videos" : "notes";

    if (level === "chapter") {
      chapter[field].push(resource);
    } else if (level === "topic") {
      if (!topicId) {
        return res.status(400).json({ success: false, message: "topicId is required for topic level" });
      }
      const topic = chapter.topics.find((t) => t.topicId === topicId);
      if (!topic) {
        return res.status(404).json({ success: false, message: "Topic not found" });
      }
      topic[field].push(resource);
    } else if (level === "subtopic") {
      if (!topicId || !subTopicId) {
        return res.status(400).json({
          success: false,
          message: "topicId and subTopicId are required for subtopic level",
        });
      }
      const topic = chapter.topics.find((t) => t.topicId === topicId);
      if (!topic) {
        return res.status(404).json({ success: false, message: "Topic not found" });
      }
      const subTopic = topic.subTopics.find((s) => s.subTopicId === subTopicId);
      if (!subTopic) {
        return res.status(404).json({ success: false, message: "SubTopic not found" });
      }
      subTopic[field].push(resource);
    }

    await syllabus.save();

    res.status(201).json({
      success: true,
      message: `${type === "video" ? "Video" : "Note"} added successfully`,
      data: resource,
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