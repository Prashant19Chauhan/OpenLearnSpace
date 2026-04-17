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
  },
  { _id: false }
);

const SubTopicSchema = new mongoose.Schema(
  {
    subTopicId: {
      type: String,
      required: true,
      unique: true,
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
      unique: true,
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
    subTopics: [SubTopicSchema],
    videos: [ResourceSchema],
    notes: [ResourceSchema],
  },
  { _id: false }
);

const ChapterSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      required: true,
      unique: true,
    },
    chapterName: {
      type: String,
      required: true,
      trim: true,
    },
    topics: [TopicSchema],
    videos: [ResourceSchema],
    notes: [ResourceSchema],
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema(
  {
    subjectId: {
        type: String,
        required: true,
    },
    syllabusId: {
      type: String,
      required: true,
      unique: true,
    },
    syllabusName: {
      type: String,
      required: true,
      trim: true,
    },
    chapters: [ChapterSchema],
  },
  {
    timestamps: true,
  }
);

const ContentModel = mongoose.model("SubjectContent", ContentSchema);

export default ContentModel;