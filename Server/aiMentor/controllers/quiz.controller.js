import axios from "axios";
import StudentContentModel from "../models/StudentContent.model.js"

export const createQuiz = async (req, res, next) => {
  try {
    const { studentId, subjectId, syllabusId, levelInfo, studentContext } =
      req.body;

    // Extract hierarchy safely
    const [chapterContext] = studentContext?.chapters || [];
    const [topicsContext] = chapterContext?.topics || [];
    const [subTopicsContext] = topicsContext?.subTopics || [];

    // Level detection
    const isLevelTillSyllabusId = levelInfo?.syllabusId;
    const isLevelTillChapterId = levelInfo?.chapterId;
    const isLevelTillTopicId = levelInfo?.topicId;
    const isLevelTillSubTopicId = levelInfo?.subTopics;

    let contextForAI = {};

    if (isLevelTillSyllabusId && !isLevelTillChapterId) {
      contextForAI = studentContext;
    } else if (isLevelTillChapterId && !isLevelTillTopicId) {
      contextForAI = chapterContext;
    } else if (isLevelTillTopicId && !isLevelTillSubTopicId) {
      contextForAI = topicsContext;
    } else if (isLevelTillSubTopicId) {
      contextForAI = subTopicsContext;
    }

const prompt = `
You are an intelligent AI tutor that generates adaptive quizzes.

Student Learning Context:
${JSON.stringify(contextForAI)}

Student Current Level:
${contextForAI?.level || "beginner"}

Instructions:

1. Understand student's knowledge level from "level"
   - beginner → easy questions
   - intermediate → medium difficulty
   - advanced → hard questions

2. Generate questions that gradually increase in difficulty:
   - Question 1 → Easy
   - Question 2 → Medium
   - Question 3 → Hard

3. Focus on weak areas from context

4. Questions must be:
   - Clear
   - Concept based
   - Not too long
   - 4 options only

5. Generate 3 Questions

Difficulty Rules:
- Beginner → Easy → Easy-Medium → Medium
- Intermediate → Medium → Medium-Hard → Hard
- Advanced → Hard → Hard → Very Hard

Output Format:
[
{
question:"",
options:["","","",""],
correctAnswerIndex:0,
difficulty:"easy | medium | hard"
}
]

Return ONLY valid JSON array.
`;

    // GROK API CALL
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an intelligent AI tutor."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiResponse =
      response?.data?.choices?.[0]?.message?.content;

    let quiz;

    try {
      quiz = JSON.parse(aiResponse);
      console.log(quiz)
    } catch (error) {
      console.log("AI Parse Error", error);
      quiz = aiResponse;
    }

    res.status(200).json({
      success: true,
      quiz,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Quiz generation failed",
    });
  }
};

// ---------------- LEVEL HELPER ----------------

const getNextLevel = (currentLevel) => {
  const levels = [
    "beginner",
    "intermediate",
    "expert",
    "master",
    "legend"
  ];

  const index = levels.indexOf(currentLevel.toLowerCase());
  if (index === -1 || index === levels.length - 1) {
    return currentLevel;
  }

  return levels[index + 1];
};


// ---------------- SET QUIZ SCORE ----------------

export const setQuizScore = async (req, res, next) => {
  try {
    const {
      scorePercentage,
      correctCount,
      levelInfo,
      studentId,
      subjectId,
      syllabusId,
      studentContext
    } = req.body;

    console.log(req.body);

    // Extract hierarchy safely
    const [chapterContext] = studentContext?.chapters || [];
    const [topicsContext] = chapterContext?.topics || [];
    const [subTopicsContext] = topicsContext?.subTopics || [];

    // Level detection
    const isLevelTillSyllabusId = levelInfo?.syllabusId;
    const isLevelTillChapterId = levelInfo?.chapterId;
    const isLevelTillTopicId = levelInfo?.topicId;
    const isLevelTillSubTopicId = levelInfo?.subTopics;

    let updateQuery = {};
    let levelUpQuery = {};
    let levelUpdatePath = {};
    let arrayFilters = [];

    // ---------------- SUBTOPIC LEVEL ----------------

    if (isLevelTillSubTopicId) {

      updateQuery = {
        studentId,
        subjectId,
        syllabusId
      };

      levelUpQuery = {
        "chapters.$[chapter].topics.$[topic].subTopics.$[subTopic].score":
          scorePercentage
      };

      levelUpdatePath = {
        "chapters.$[chapter].topics.$[topic].subTopics.$[subTopic].level":
          null
      };

      arrayFilters = [
        { "chapter.chapterId": chapterContext?.chapterId },
        { "topic.topicId": topicsContext?.topicId },
        { "subTopic.subTopicId": subTopicsContext?.subTopicId }
      ];
    }

    // ---------------- TOPIC LEVEL ----------------

    else if (isLevelTillTopicId) {

      updateQuery = {
        studentId,
        subjectId,
        syllabusId
      };

      levelUpQuery = {
        "chapters.$[chapter].topics.$[topic].score":
          scorePercentage
      };

      levelUpdatePath = {
        "chapters.$[chapter].topics.$[topic].level":
          null
      };

      arrayFilters = [
        { "chapter.chapterId": chapterContext?.chapterId },
        { "topic.topicId": topicsContext?.topicId }
      ];
    }

    // ---------------- CHAPTER LEVEL ----------------

    else if (isLevelTillChapterId) {

      updateQuery = {
        studentId,
        subjectId,
        syllabusId
      };

      levelUpQuery = {
        "chapters.$[chapter].score":
          scorePercentage
      };

      levelUpdatePath = {
        "chapters.$[chapter].level":
          null
      };

      arrayFilters = [
        { "chapter.chapterId": chapterContext?.chapterId }
      ];
    }

    // ---------------- SYLLABUS LEVEL ----------------

    else if (isLevelTillSyllabusId) {

      updateQuery = {
        studentId,
        subjectId,
        syllabusId
      };

      levelUpQuery = {
        score: scorePercentage
      };

      levelUpdatePath = {
        level: null
      };
    }

    // ---------------- CURRENT LEVEL ----------------

    let currentLevel =
      subTopicsContext?.level ||
      topicsContext?.level ||
      chapterContext?.level ||
      levelInfo?.level ||
      "beginner";

    let newLevel = currentLevel;

    // ---------------- LEVEL UP LOGIC ----------------

    if (scorePercentage >= 80) {
      newLevel = getNextLevel(currentLevel);
      console.log(newLevel)
    }

    // ---------------- ASSIGN LEVEL ----------------

    Object.keys(levelUpdatePath).forEach(key => {
      levelUpdatePath[key] = newLevel;
    });


    // ---------------- UPDATE DATABASE ----------------

    let updateOptions = {
      new: true
    };

    if (arrayFilters.length > 0) {
      updateOptions.arrayFilters = arrayFilters;
    }

    await StudentContentModel.findOneAndUpdate(
      updateQuery,
      {
        $set: {
          ...levelUpQuery,
          ...levelUpdatePath
        }
      },
      updateOptions
    );


    res.status(200).json({
      success: true,
      message: "Score Updated",
      level: newLevel
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Score update failed"
    });
  }
};