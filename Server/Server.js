import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express()

app.use(cookieParser());

dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",  // frontend origin
  credentials: true,                // allow cookies/credentials
}));

app.use(express.json());

//mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err))


app.use("/teacherImages", express.static(path.resolve("teacherImages")));
app.use("/studentsImages", express.static(path.resolve("studentsImages")));
app.use("/employeeImages", express.static(path.resolve("employeeImages")));



  
//platform-Dashboard Routes
import plateformRoute_Auth from "./Platform/Routes/Auth.route.js"
import platformRoute_Institute from "./Platform/Routes/Institute.route.js"
import platformRoute_Management from "./Platform/Routes/Management.route.js"

app.use("/api/platform/auth", plateformRoute_Auth)
app.use("/api/platform/institute", platformRoute_Institute)
app.use("/api/platform/management", platformRoute_Management)


//Institute-Dashboard Routes
import instituteRoute_Auth from "./Institute/Administration/Routes/Auth.route.js"
import instituteRoute_Teacher from "./Institute/Administration/Routes/Teacher.route.js"
import instituteRoute_Student from "./Institute/Administration/Routes/Student.route.js"
import instituteRoute_Employee from "./Institute/Administration/Routes/Employee.route.js"

app.use("/api/institute/auth", instituteRoute_Auth)
app.use("/api/institute/teacher", instituteRoute_Teacher)

app.use("/api/institute/student", instituteRoute_Student)
app.use("/api/institute/employee", instituteRoute_Employee)

//Institute-Program Routes
import instituteRoute_Program from "./Institute/Academic/Routes/Program.route.js"
import instituteRoute_Program_Batch from "./Institute/Academic/Routes/Batch.route.js"
import instituteRoute_Program_Batch_Subject from "./Institute/Academic/Routes/Subject.route.js";

app.use("/api/institute/program", instituteRoute_Program)
app.use("/api/institute/program/:programId/batch", instituteRoute_Program_Batch)
app.use("/api/institute/program/:programId/batch/:batchId/subject", instituteRoute_Program_Batch_Subject);

//Institute-Content Routes
import instituteRoute_Content from "./Institute/Content/Routes/content.route.js";

app.use("/api/institute/content", instituteRoute_Content);

//Institute-Examination Routes
import instituteRoute_Examination from "./Institute/Examination/Routes/Examination.route.js";

app.use("/api/institute/exam", instituteRoute_Examination);

//Institute-Communication Routes
import instituteRoute_Notice from "./Institute/Communication/Routes/Notice.route.js";
import instituteRoute_Complain from "./Institute/Communication/Routes/Complain.route.js";

app.use("/api/institute/communication/notices", instituteRoute_Notice);
app.use("/api/institute/communication/complains", instituteRoute_Complain)

//Institute-Finance Routes
import instituteRoute_Expense from "./Institute/Finance/Routes/Expense.route.js";
import instituteRoute_Fee from "./Institute/Finance/Routes/Fee.route.js";
import instituteRoute_Salary from "./Institute/Finance/Routes/Salary.route.js";

app.use("/api/institute/finance/expenses", instituteRoute_Expense);
app.use("/api/institute/finance/fees", instituteRoute_Fee);
app.use("/api/institute/finance/salaries", instituteRoute_Salary);


//student-Dashboard Route
import studentRoute_Auth from "./Student/Routes/Auth.route.js";
import studentRoute_Program from "./Student/Routes/Program.route.js";
import studentRoute_Finance from "./Student/Routes/Finance.route.js";
import studentRoute_Communication from "./Student/Routes/Communication.route.js";
import studentRoute_Content from "./Student/Routes/Content.routes.js"

app.use("/api/student/auth", studentRoute_Auth);
app.use("/api/student/program", studentRoute_Program);
app.use("/api/student/finance", studentRoute_Finance);
app.use("/api/student/communication", studentRoute_Communication);
app.use("/api/student/content", studentRoute_Content);

  //Teacher-Dashboard Route
import teacherRoute_Auth from "./Teacher/Routes/Auth.route.js"
import teacherRoute_Finance from  "./Teacher/Routes/Finance.route.js"
import teacherRoute_Communication from "./Teacher/Routes/Communication.route.js"
import teacharRoute_Program from "./Teacher/Routes/Program.route.js"
import teacherRoute_Content from "./Teacher/Routes/Content.routes.js"

app.use("/api/teacher/auth", teacherRoute_Auth);
app.use("/api/teacher/finance", teacherRoute_Finance);
app.use("/api/teacher/communication", teacherRoute_Communication);
app.use("/api/teacher/program", teacharRoute_Program);
app.use("/api/teacher/content", teacherRoute_Content)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
})

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})
