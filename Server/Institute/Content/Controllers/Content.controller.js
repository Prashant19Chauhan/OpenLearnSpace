import ContentModel from "../Models/Content.model.js";
import { errorHandler } from "../../../Utils/Error.js";
import { nanoid } from "nanoid";

/**
 * Create new content
 * @route POST /api/institute/content/create
 * @access Private
 */
export const createContent = async (req, res, next) => {
  try {
    const { name, description, type, subjectIds, access } = req.body;

    // Validate required fields
    if (!name || !type || !subjectIds) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Validate content type
    const validTypes = ["video", "document", "quiz", "audio", "image", "link"];
    if (!validTypes.includes(type)) {
      return next(errorHandler(400, `Invalid content type. Valid types: ${validTypes.join(", ")}`));
    }

    // Generate unique content ID
    const contentId = "INST-CNT-" + nanoid(10);

    const newContent = new ContentModel({
      contentId,
      name,
      description,
      type,
      subjectIds,
      access: access || "private"
    });

    await newContent.save();

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: newContent
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get all content with filters and pagination
 * @route GET /api/institute/content/list
 * @access Private
 */
export const getAllContent = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      subjectId, 
      type, 
      access,
      search 
    } = req.query;

    const filter = {};

    // Filter by subject
    if (subjectId) {
      filter.subjectIds = { $in: [subjectId] };
    }

    // Filter by type
    if (type) {
      filter.type = type;
    }

    // Filter by access
    if (access) {
      filter.access = access;
    }

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const contentList = await ContentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalContent = await ContentModel.countDocuments(filter);
    const totalPages = Math.ceil(totalContent / limitNum);

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully",
      data: {
        contentList,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalContent,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get content by ID
 * @route GET /api/institute/content/:contentId
 * @access Private
 */
export const getContentById = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const content = await ContentModel.findOne({ contentId });
    if (!content) {
      return next(errorHandler(404, "Content not found"));
    }

    res.status(200).json({
      success: true,
      message: "Content details retrieved successfully",
      data: content
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Update content by ID
 * @route PUT /api/institute/content/:contentId
 * @access Private
 */
export const updateContent = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const { name, description, type, subjectIds, access } = req.body;

    const content = await ContentModel.findOne({ contentId });
    if (!content) {
      return next(errorHandler(404, "Content not found"));
    }

    // Update fields if provided
    if (name) content.name = name;
    if (description) content.description = description;
    if (type) {
      const validTypes = ["video", "document", "quiz", "audio", "image", "link"];
      if (!validTypes.includes(type)) {
        return next(errorHandler(400, `Invalid content type. Valid types: ${validTypes.join(", ")}`));
      }
      content.type = type;
    }
    if (subjectIds) content.subjectIds = subjectIds;
    if (access) content.access = access;

    await content.save();

    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: content
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Delete content by ID
 * @route DELETE /api/institute/content/:contentId
 * @access Private
 */
export const deleteContent = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const content = await ContentModel.findOneAndDelete({ contentId });
    if (!content) {
      return next(errorHandler(404, "Content not found"));
    }

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
      data: content
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};