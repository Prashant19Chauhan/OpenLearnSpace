import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    understandingLevel: {
        type: String,
    },
    completed: {
      type: Boolean,
    }
  },
  { _id: false }
);

const SubTopicSchema = new mongoose.Schema(
  {
    subTopicId: {
      type: String,
      required: true,
    },
    subTopicName: {
      type: String,
      required: true,
      trim: true,
    },
    chapterId: {
      type: String,
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    level: {
        type: String,
    },
    score: {
        type: Number,
    },
    videos: [ResourceSchema],
    notes: [ResourceSchema],
  },
  { _id: false }
);

const TopicSchema = new mongoose.Schema(
  {
    topicId: {
      type: String,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    chapterId: {
      type: String,
      required: true,
    },
    level: {
        type: String,
    },
    score: {
        type: Number,
    },
    subTopics: [SubTopicSchema],
  },
  { _id: false }
);

const ChapterSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
        type: String,
    },
    score: {
        type: Number,
    },
    topics: [TopicSchema],
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema(
  {
    studentId: {
        type: String,
        required: true,
    },
    subjectId: {
        type: String,
        required: true,
    },
    syllabusId: {
      type: String,
      required: true,
    },
    syllabusName: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
        type: String,
    },
    score: {
        type: Number,
    },
    chapters: [ChapterSchema],
  },
  {
    timestamps: true,
  }
);

const StudentContentModel = mongoose.model("SubjectContentOfStudent", ContentSchema);

export default StudentContentModel;