import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, CheckCircle2, Timer, Award, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../Api/Api.js";

const DUMMY_QUIZ = [
  {
    question: "Which of the following best describes a 'Closure' in JavaScript?",
    options: [
      "A function combined with its lexical environment",
      "A way to close a browser window",
      "A method to terminate a loop early",
      "A type of CSS selector for hidden elements"
    ],
    correctAnswer: 0
  },
  {
    question: "What is the primary purpose of the React 'useEffect' hook?",
    options: [
      "To style components",
      "To handle side effects in functional components",
      "To create new HTML elements",
      "To speed up database queries"
    ],
    correctAnswerIndex: 1
  }
];

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { levelInfo, studentId, subjectId, syllabusId, studentContext } = location.state || {};

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchQuiz = async () => {
    try {
        console.log(levelInfo)
        console.log(studentId)
        console.log(subjectId)
        console.log(syllabusId)
        console.log(studentContext)
      setLoading(true);
      const response = await api.post("/api/ai/quiz/createQuiz", { studentId, subjectId, syllabusId, levelInfo, studentContext });
      if(response.data.success && response.data.quiz.length > 0){
        setQuiz(response.data.quiz);
      } else {
        setQuiz(DUMMY_QUIZ);
      }

      setLoading(false);

    } catch (error) {
      console.error(error);
      setQuiz(DUMMY_QUIZ);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentStep]: optionIndex });
  };

  const progress = quiz.length > 0 ? ((currentStep + 1) / quiz.length) * 100 : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 font-bold animate-pulse">Generating your AI Quiz...</p>
    </div>
  );

  if (isSubmitted) return <ResultView quiz={quiz} answers={answers} studentId={studentId} subjectId={subjectId} syllabusId={syllabusId} levelInfo={levelInfo} studentContext={studentContext}/>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header & Progress */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 font-bold text-sm">
            <ChevronLeft size={18} /> Back to Course
          </button>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Question {currentStep + 1} of {quiz.length}</span>
              <div className="flex items-center gap-2 text-slate-400">
                <Timer size={16} />
                <span className="text-xs font-bold">No Time Limit</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-8 leading-tight">
                {quiz[currentStep].question}
              </h2>

              <div className="space-y-4">
                {quiz[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      answers[currentStep] === i 
                      ? "border-indigo-600 bg-indigo-50/50 shadow-md" 
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                        answers[currentStep] === i ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={`font-bold ${answers[currentStep] === i ? "text-indigo-900" : "text-slate-600"}`}>
                        {opt}
                      </span>
                    </div>
                    {answers[currentStep] === i && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-50">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
              >
                Previous
              </button>
              
              {currentStep === quiz.length - 1 ? (
                <button
                  onClick={() => setIsSubmitted(true)}
                  disabled={answers[currentStep] === undefined}
                  className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={answers[currentStep] === undefined}
                  className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  Next Question <ChevronRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Results View Component ---
const ResultView = ({ quiz, answers, studentId, subjectId, syllabusId, levelInfo, studentContext }) => {
  const navigate = useNavigate();
  const correctCount = quiz.filter((q, i) => answers[i] === q.correctAnswerIndex).length;
  const scorePercentage = ((correctCount / quiz.length) * 100).toFixed(2);
  const updateResult = async() => {
    try{
      const response = await api.post("/api/ai/quiz/performanceUpdate", {correctCount, scorePercentage, studentId, subjectId, syllabusId, levelInfo, studentContext });
      console.log(response)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updateResult();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-8 border border-slate-200 shadow-xl text-center"
      >
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Award size={40} />
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 font-medium mb-8">You've earned new XP for your progress.</p>

        <div className="bg-slate-50 rounded-3xl p-6 mb-8 flex justify-around">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
            <p className="text-2xl font-black text-indigo-600">{scorePercentage}%</p>
          </div>
          <div className="border-x border-slate-200 px-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct</p>
              <p className="text-2xl font-black text-emerald-600">{correctCount}/{quiz.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Retake Quiz
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="w-full bg-white text-slate-600 border-2 border-slate-100 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Continue Learning
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;