import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Circle,
  BrainCircuit,
  LayoutGrid,
  PlayCircle,
  FileText,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../Api/Api";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/student/content";

function StudentContentTab({ subjectId, studentId }) {
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  // Helper to toggle accordion states
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchSyllabusData = async () => {
    try {
      const response = await api.get(API_URL, { params: { subjectId, studentId } });
      if (response.data.success) {
        const data = response.data.data;
        setSyllabus(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSyllabus([]);
    }
  };

  const toggleComplete = async (resourceId, status) => {
    try {
      await api.post(`${API_URL}/mark-complete`, {
        resourceId,
        completed: status,
      });
      fetchSyllabusData(); // Refresh data to show updated status and scores
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  useEffect(() => {
    fetchSyllabusData();
  }, [subjectId, studentId]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* --- PAGE HEADER --- */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Course Content</h1>
          <p className="text-slate-500 font-medium">Master your subject level by level</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank / Score</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">
              {syllabus.reduce((acc, s) => acc + (s.score || 0), 0) / syllabus.length} XP
            </p>
          </div>
        </div>
      </header>

      {/* --- CONTENT TREE --- */}
      <div className="space-y-6">
        {syllabus.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-bold">No content available for this subject yet.</p>
          </div>
        ) : (
          syllabus.map((s) => (
            <TierContainer 
              key={s.syllabusId} 
              subjectId={subjectId}
              studentId={studentId}
              syllabusId={s.syllabusId}
              studentContext = {s}
              chapterId={''}
              title={s.syllabusName}
              level={s.level}
              score={s.score}
              isExpanded={expandedItems[s.syllabusId]}
              onToggle={() => toggleExpand(s.syllabusId)}
            >
              {s.chapters?.map((chapter) => (
                <TierContainer 
                  key={chapter.chapterId} 
                  subjectId={subjectId}
                  studentId={studentId}
                  syllabusId={s.syllabusId}
                  studentContext={s}
                  chapterId={chapter.chapterId}
                  title={chapter.chapterName}
                  level={chapter.level}
                  score={chapter.score}
                  isExpanded={expandedItems[chapter.chapterId]}
                  onToggle={() => toggleExpand(chapter.chapterId)}
                  isNested
                >
                  {chapter.topics?.map((topic) => {
                    const handleQuiz = () => {
                      navigate(
                        `/quiz/topic-${topic.topicId}`,
                        {
                          state: {
                            levelInfo: {syllabusId: s.syllabusId, chapterId:chapter.chapterId, topicId:topic.topicId},
                            studentId,
                            subjectId,
                            syllabusId: s.syllabusId,
                            studentContext: s,
                          }
                        }
                      );
                    };

                    const handleAiAssist = async() => {
                      try{
                        const response = await api.post("/api/ai/content/createContent", {
                          levelInfo: {syllabusId: s.syllabusId, chapterId:chapter.chapterId, topicId:topic.topicId},
                            studentId,
                            subjectId,
                            syllabusId: s.syllabusId,
                            studentContext: s,
                        })
                        console.log(response)
                      }catch(err){
                        console.log(err)
                      }
                    };

                    return(
                    <div key={topic.topicId} className="ml-2 md:ml-10 mt-6 border-l-2 border-slate-100 pl-4 md:pl-8 pb-4">
                      {/* Topic Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <LayoutGrid size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-700">{topic.topicName}</h4>
                            <ScoreBadge score={topic.score} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <LevelActionButton icon={<Sparkles size={14}/>} label="Topic AI" theme="ai" onClick={handleAiAssist}/>
                          <LevelActionButton icon={<Trophy size={14}/>} label="Level Quiz" theme="quiz" onClick={handleQuiz}/>
                        </div>
                      </div>

                      {/* SubTopics Grid */}
                      <div className="grid grid-cols-1 gap-6">
                        {topic.subTopics?.map((sub, index) => (
                          <SubTopicGroup 
                            key={sub.subTopicId} 
                            sub={sub} 
                            toggleComplete={toggleComplete} 
                            index={index}
                            studentId={studentId}
                            syllabusId={s.syllabusId}
                            subjectId={subjectId}
                            studentContext={s}
                          />
                        ))}
                      </div>
                    </div>
                    )
                  })}
                </TierContainer>
              ))}
            </TierContainer>
          ))
        )}
      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

const TierContainer = ({ studentId, subjectId, syllabusId, studentContext, chapterId, title, level, score, children, isExpanded, onToggle, isNested = false }) => {
  const navigate = useNavigate();
  const handleQuiz = () => {
    const url = chapterId.length<1?`course-${syllabusId}`: `chapter-${chapterId}`
    navigate(
      `/quiz/${url}`,
      {
        state: {
          levelInfo: chapterId.length<1? {syllabusId}: {chapterId, syllabusId},
          studentId,
          subjectId,
          syllabusId: syllabusId,
          studentContext
        }
      }
    );
  };

  const handleAiAssist = async() => {
    try{
      const response = await api.post("/api/ai/content/createContent", {
        levelInfo: chapterId.length<1? {syllabusId}: {chapterId, syllabusId},
        studentId,
        subjectId,
        syllabusId: syllabusId,
        studentContext
      })
    console.log(response)
    }catch(err){
      console.log(err)
    }
  };

  return(
    <div className={`${isNested ? 'mt-4 ml-2 md:ml-10' : ''} bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden`}>
    <div 
      className={`p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-all ${isExpanded ? 'bg-slate-50/80' : ''}`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight className="text-slate-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className={`${isNested ? 'text-base md:text-lg' : 'text-lg md:text-xl'} font-black text-slate-800`}>{title}</h3>
            <ScoreBadge score={score} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Level {level} Masterclass</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <LevelActionButton icon={<BrainCircuit size={16}/>} label="AI Assist" theme="ai" onClick={handleAiAssist}/>
        <LevelActionButton icon={<Trophy size={16}/>} label="Level Quiz" theme="quiz" onClick={handleQuiz}/>
      </div>
    </div>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-[#fcfcfd] border-t border-slate-100 p-2 md:p-6"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  )
  
};

const SubTopicGroup = ({ sub, studentContext, toggleComplete, index, studentId, subjectId, syllabusId }) => {
  const navigate = useNavigate();
  const handleQuiz = () => {
    navigate(
      `/quiz/subTopic-${sub.subTopicId}`,
      {
        state: {
          levelInfo: {syllabusId, chapterId: sub.chapterId, topicId: sub.topicId, subTopicId: sub.subTopicId},
          studentId,
          subjectId,
          syllabusId,
          studentContext
        }
      }
    );
  };

  const handleAiAssist = async() => {
    try{
      const response = await api.post("/api/ai/content/createContent", {
        levelInfo: {syllabusId, chapterId: sub.chapterId, topicId: sub.topicId, subTopicId: sub.subTopicId},
        studentId,
        subjectId,
        syllabusId: syllabusId,
        studentContext
      })
    console.log(response)
    }catch(err){
      console.log(err)
    }
  };
  return(
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-6">
      <h5 className="font-extrabold text-slate-700 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center bg-indigo-600 text-white rounded-lg text-xs shadow-md shadow-indigo-200">
          {index+1}
        </span>
        {sub.subTopicName}
      </h5>
      <div className="flex items-center gap-2">
        <LevelActionButton icon={<Sparkles size={12}/>} label="Subtopic AI" theme="ai" onClick={handleAiAssist}/>
        <LevelActionButton icon={<Trophy size={16}/>} label="Level Quiz" theme="quiz" onClick={handleQuiz}/>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Videos Section */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
          <PlayCircle size={14} className="text-red-500" /> Video Resources
        </p>
        {sub.videos?.map((v) => (
          <ResourceItem key={v.resourceId} item={v} type="video" toggleComplete={toggleComplete} />
        ))}
      </div>

      {/* Notes Section */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
          <FileText size={14} className="text-blue-500" /> Study Material
        </p>
        {sub.notes?.map((n) => (
          <ResourceItem key={n.resourceId} item={n} type="note" toggleComplete={toggleComplete} />
        ))}
      </div>
    </div>
  </div>
  )
};

const ResourceItem = ({ item, type, toggleComplete }) => (
  <div className="group flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`p-2 rounded-lg ${type === 'video' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
        {type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
      </div>
      <div className="overflow-hidden">
        <a 
          href={item.url} 
          target="_blank" 
          rel="noreferrer" 
          className="text-sm font-bold text-slate-700 hover:text-indigo-600 truncate block transition-colors"
        >
          {item.title}
        </a>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase">
            {item.understandingLevel || "Beginner"}
          </span>
        </div>
      </div>
    </div>
    
    <button 
      onClick={() => toggleComplete(item.resourceId, !item.completed)}
      className={`ml-2 transition-all transform active:scale-90 ${
        item.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'
      }`}
    >
      <CheckCircle2 size={24} fill={item.completed ? "currentColor" : "none"} strokeWidth={item.completed ? 1.5 : 1} />
    </button>
  </div>
);

const ScoreBadge = ({ score }) => (
  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md">
    <span className="text-[10px] font-black text-emerald-600 leading-none">{score || 0} XP</span>
  </div>
);

const LevelActionButton = ({ icon, label, theme, ...props }) => {
  const themes = {
    ai: "text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-600 hover:text-white",
    quiz: "text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-600 hover:text-white"
  };
  
  return (
    <button 
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border shadow-sm active:translate-y-0.5 ${themes[theme]}`}
      {...props}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

export default StudentContentTab;