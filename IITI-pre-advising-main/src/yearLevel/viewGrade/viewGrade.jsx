import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import back from "../../assets/photo/arrow.png";
import adminLogo from "../../dashboard/dashboardLOGO/adminLogo.png";

const StudentGrades = () => {
  const location = useLocation();
  const passedStudent = location.state?.student;
  const from = location.state?.from ?? 'list';
  const backPath = from === 'dashboard' ? '/dashboard' : '/list';
  const breadcrumb = from === 'dashboard'
    ? { parent: 'Dashboard', parentPath: '/dashboard' }
    : { parent: 'BSIT 1st Year  ►  Students', parentPath: '/list' };

  const [studentName, setStudentName] = useState(passedStudent?.name ?? "");
  const [yearSection, setYearSection] = useState(passedStudent?.section ?? "");
  const [studentNumber, setStudentNumber] = useState(
    passedStudent?.number ?? passedStudent?.student_no ?? passedStudent?.student_number ?? ""
  );
  const [subjects, setSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("1st Semester 2024-2025");

  const semesterOptions = [
    "1st Semester 2023-2024",
    "2nd Semester 2023-2024",
    "1st Semester 2024-2025",
    "2nd Semester 2024-2025",
  ];

  useEffect(() => {
    const id =
      passedStudent?.number ??
      passedStudent?.student_no ??
      passedStudent?.student_number;
    if (!id) return;

    fetch(`/bridge/student/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const s = data.data?.student || {};
          const loadedGrades = data.data?.grades || [];
          setStudentName(s.name || passedStudent?.name || "");
          setYearSection(s.section || passedStudent?.section || "");
          setStudentNumber(s.number || s.student_no || id);
          setSubjects(loadedGrades);
        }
      })
      .catch(() => {});
  }, []);

  const displayedSubjects = subjects.filter((s) => {
    const sem =
      s.semester === "1" ? "1st" : s.semester === "2" ? "2nd" : s.semester;
    const label = `${sem} Semester ${s.schoolYear}`;
    return label === selectedSemester;
  });

  const validGrades = displayedSubjects
    .map((s) => parseFloat(s.finalGrade))
    .filter((g) => !isNaN(g) && g > 0);

  const gwa =
    validGrades.length > 0
      ? (validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(2)
      : "—";

  return (
    <div className="h-full pl-[55%] md:pl-88 font-RB w-full bg-[#F5F5F5] min-h-screen">
      <div className="p-5 bg-gray-100 pt-14 flex justify-between border-b-5 border-[#D9D9D9] sticky top-0">
        <div className="flex flex-col items-start gap-1 text-[25px]">
          <Link to={backPath}>
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">{breadcrumb.parent}</span>
            <span className="font-bold text-black/50">►</span>
            <span className="font-bold text-black">Student</span>
          </div>
        </div>
        <Link to="/profile">
          <div className="flex-col cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto p-8 text-sm">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <h1>
              Name : <span className="ml-2">{studentName}</span>
            </h1>
            <h1>
              Year and Section : <span className="ml-2">{yearSection}</span>
            </h1>
          </div>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <label className="bg-[#F5F5F5] px-1 text-[10px] text-gray-500">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="border border-gray-400 px-4 py-2 pr-8 bg-white text-sm outline-none"
            >
              {semesterOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-gray-300 bg-white shadow px-6 py-2 text-sm">
            Student Id : <span className="ml-2">{studentNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-6 text-center text-sm mb-6 px-2">
          <div></div>
          <div>Prelim</div>
          <div>Midterm</div>
          <div>Pre-Final</div>
          <div>Final</div>
          <div>Final Grade</div>
        </div>

        <div className="space-y-2">
          {displayedSubjects.length > 0 ? (
            displayedSubjects.map((subject, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center border-b border-gray-300 py-2 px-2 text-sm"
              >
                <div className="text-left">
                  <h2>{subject.code}</h2>
                  <p className="text-[11px] text-gray-600">{subject.instructor}</p>
                </div>
                <div className="text-center">{subject.prelim}</div>
                <div className="text-center">{subject.midterm}</div>
                <div className="text-center">{subject.preFinal}</div>
                <div className="text-center">{subject.final}</div>
                <div className="text-center">{subject.finalGrade}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              No grades found for this semester.
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 text-sm">
          <span className="mr-3">GWA :</span>
          <span className="text-green-700">{gwa}</span>
        </div>
      </main>
    </div>
  );
};

export default StudentGrades;