import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import adminLogo from "./dashboardLOGO/adminLogo.png";
import search from "../assets/photo/search.png";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRegular, setTotalRegular] = useState(0);
  const [totalIrregular, setTotalIrregular] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [lookupStudentName, setLookupStudentName] = useState("");
  const [lookupStudentId, setLookupStudentId] = useState("");
  const [lookupYearSection, setLookupYearSection] = useState("");
  const [lookupAllGrades, setLookupAllGrades] = useState([]);
  const [lookupGrades, setLookupGrades] = useState([]);
  const [lookupSemesterOptions, setLookupSemesterOptions] = useState([]);
  const [lookupSelectedSemester, setLookupSelectedSemester] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const buildSemLabel = (grade) => {
    const raw = grade.semester || "";
    const sy = grade.schoolYear || grade.school_year || "";

    if (/semester/i.test(raw) && /\d{4}/.test(raw)) return raw;

    const ordinals = { "1": "1st", "2": "2nd", "3": "3rd" };
    const semOrd = ordinals[String(raw).trim()] || `${raw}`;

    if (!sy || sy.toString().trim() === "") return "Credited";
    return `${semOrd} Semester ${sy}`;
  };

  const semesterSortKey = (label) => {
    if (label === "Credited") return -1;
    const match = label.match(/(\d+)(?:st|nd|rd|th)?\s+Semester\s+(\d{4})/i);
    if (!match) return 0;
    return parseInt(match[2]) * 10 + parseInt(match[1]);
  };

  const getSemesterOptions = (grades) => {
    const semMap = new Map();
    grades.forEach((grade) => {
      const label = buildSemLabel(grade);
      if (label) semMap.set(label, semesterSortKey(label));
    });

    const sorted = [...semMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label);

    if (!sorted.includes("Credited")) sorted.push("Credited");
    return sorted;
  };

  const getGradesForSemester = (grades, semester) =>
    grades.filter((grade) => buildSemLabel(grade) === semester);

  const loadStudentById = (id) => {
    const studentId = String(id || "").trim();
    if (!studentId) return;

    setLookupLoading(true);
    setLookupError("");

    fetch(`/bridge/student/${encodeURIComponent(studentId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const student = data.data?.student || {};
          const grades = data.data?.grades || [];
          const studentNumber =
            student.number || student.student_no || student.student_number || studentId;
          const studentName =
            student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim();

          setLookupStudentName(studentName);
          setLookupStudentId(studentNumber);
          setLookupYearSection(student.section || "");
          setLookupAllGrades(grades);

          const semOptions = getSemesterOptions(grades);
          setLookupSemesterOptions(semOptions);
          const selected = semOptions[0] || "";
          setLookupSelectedSemester(selected);
          setLookupGrades(getGradesForSemester(grades, selected));
        } else {
          setLookupError("Student information not found.");
          setLookupGrades([]);
          setLookupAllGrades([]);
          setLookupSemesterOptions([]);
        }
      })
      .catch(() => {
        setLookupError("Failed to load student grades.");
        setLookupGrades([]);
        setLookupAllGrades([]);
        setLookupSemesterOptions([]);
      })
      .finally(() => setLookupLoading(false));
  };

  const handleSelectStudent = (student) => {
    const studentId =
      student.number || student.student_no || student.student_number || student.id;
    if (!studentId) return;
    loadStudentById(studentId);
  };

  const handleStudentIdKeyDown = (e) => {
    if (e.key === "Enter") {
      loadStudentById(lookupStudentId);
    }
  };

  useEffect(() => {
    if (!lookupSelectedSemester) return;
    setLookupGrades(getGradesForSemester(lookupAllGrades, lookupSelectedSemester));
  }, [lookupAllGrades, lookupSelectedSemester]);

  useEffect(() => {
    fetch('/bridge/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStudents(data.data.students)
          setTotalStudents(data.data.total_students)
          setTotalRegular(data.data.total_regular)
          setTotalIrregular(data.data.total_irregular)
        }
      })
  }, [])
  return (
    <div className=" h-full pl-[55%] md:pl-88 font-RB w-full">
      <div>
        {/*Title and admin*/}
        <div
          className="px-5 pt-2 flex justify-between
                            border-b-5 border-[#D9D9D9]"
        >
          <h1 className="font-bold text-2xl p-5">Dashboard</h1>
          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-3 grid grid-rows-2 gap-2 h-full">
          {/* FIRST ROW */}
          <div className="grid grid-cols-2 gap-2">
            {/* TOP LEFT - Student Tabs */}
            <div className="rounded-lg p-3.5">
                <div className="flex w-full gap-2 mb-4">
                <button className="flex-1 bg-[#1C6100] text-white text-sm px-4 py-1.5 rounded-md">
                  Total Student: {totalStudents}
                </button>
                <button className="flex-1 border text-sm px-4 py-1.5 rounded-md text-gray-500">
                  Regular Student: {totalRegular}
                </button>
                <button className="flex-1 border text-sm px-4 py-1.5 rounded-md text-gray-500 bg-[#FFF8E7]">
                  Irregular Student: {totalIrregular}
                </button>
              </div>
            </div>

            {/* TOP RIGHT - Student Management */}
            <div className="border rounded-lg p-3.5">
              <h2 className="border-b pb-1.5 text-sm font-semibold text-gray-500 mb-3">
                Student Management
              </h2>

              {/* Search */}
              <div className="flex gap-2 mb-3">
                <div className="flex items-center w-2/3 border rounded-md px-2 py-1">
                  <input
                    type="text"
                    className="text-sm outline-none w-full"
                    placeholder="Search Student"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <img src={search} alt="search" className="w-4 h-4 ml-2" />
                </div>
                <button className="border flex-1 rounded-md px-4 py-1 text-sm text-gray-500 whitespace-nowrap"></button>
                <button className="border flex-1 rounded-md px-4 py-1 text-sm text-gray-500 whitespace-nowrap"></button>
              </div>

              {/* Table */}
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] bg-[#1C6100] text-white text-sm">
                  <span className="px-2 py-2 border-r border-white/30">
                    Student Number
                  </span>
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Name
                  </span>
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Status
                  </span>
                  <span className="px-2 py-2"></span>
                </div>
                {(() => {
                  const filteredStudents = (students || []).filter(s =>
                    (s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim()).toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (s.number ?? s.student_no ?? s.student_number ?? '').toString().includes(searchQuery) ||
                    (s.status ?? '').toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (filteredStudents.length > 0) {
                    return filteredStudents.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectStudent(s)}
                        className="grid grid-cols-[1fr_1fr_1fr_1fr] text-sm h-8 items-center border-b border-[#D9D9D9]/50 cursor-pointer hover:bg-gray-100"
                      >
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center">
                          {s.number ?? s.student_no ?? s.student_number ?? s.id ?? "—"}
                        </span>
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                          {s.name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || "-"}
                        </span>
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                          {s.status ?? "—"}
                        </span>
                        <span className="px-2 h-full flex items-center justify-center">
                          {(() => {
                            const studentId = s.number ?? s.student_no ?? s.student_number ?? s.id ?? '';
                            return (
                              <Link
                                to={`/viewGrade?id=${encodeURIComponent(studentId)}`}
                                state={{ student: s, from: 'dashboard', studentId }}
                                className="text-sm text-blue-600"
                              >
                                View
                              </Link>
                            );
                          })()}
                        </span>
                      </div>
                    ));
                  }

                  return (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                      <p className="text-sm font-semibold">No students found</p>
                      {searchQuery && (
                        <p className="text-xs mt-1">No results for "<span className="text-gray-600">{searchQuery}</span>"</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-2 gap-2">
            {/* BOTTOM LEFT - Student Info + Subjects */}
            <div className="border rounded-lg p-3.5 flex flex-col gap-2">
              {/* Student Info Fields */}
              <input
                type="text"
                placeholder="Student Name:"
                value={lookupStudentName}
                onChange={(e) => setLookupStudentName(e.target.value)}
                className="border rounded-md p-1.5 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Student ID:"
                value={lookupStudentId}
                onChange={(e) => setLookupStudentId(e.target.value)}
                onKeyDown={handleStudentIdKeyDown}
                className="border rounded-md p-1.5 text-sm w-full"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Year Level:"
                  value=""
                  readOnly
                  className="border rounded-md p-1.5 text-sm w-1/2 bg-[#F5F5F5]"
                />
                <input
                  type="text"
                  placeholder="Section:"
                  value={lookupYearSection}
                  readOnly
                  className="border rounded-md p-1.5 text-sm w-1/2 bg-[#F5F5F5]"
                />
              </div>

              {/* Subject Table */}
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden">
                {/* Subject Table Header */}
                <div className="grid grid-cols-[80px_1fr_60px_100px] bg-[#1C6100] text-white text-sm text-center">
                  <span className="px-2 py-2 border-r border-white/30">Code</span>
                  <span className="px-2 py-2 border-r border-white/30">Subject Title</span>
                  <span className="px-2 py-2 border-r border-white/30">Units</span>
                  <span className="px-2 py-2">Status</span>
                </div>

                {lookupLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading grades…</div>
                ) : lookupGrades.length > 0 ? (
                  lookupGrades.map((grade, index) => {
                    const statusRaw = (grade.status || "").toLowerCase();
                    const passed = ["completed", "credited", "passed"].includes(statusRaw);
                    const statusLabel = passed ? "Completed" : "Incomplete";
                    const statusColor = passed ? "text-green-600" : "text-red-500";
                    const code = grade.code || grade.subject_code || "";
                    const title = grade.title || grade.subject_title || grade.subject || "";
                    const units = grade.units ?? grade.unit ?? "";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-[80px_1fr_60px_100px] text-sm h-8 items-center border-b border-[#D9D9D9]/50"
                      >
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center">
                          {code}
                        </span>
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center truncate">
                          {title}
                        </span>
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                          {units}
                        </span>
                        <span className={`px-2 h-full flex items-center justify-center ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <p className="text-sm font-semibold">No grades found</p>
                    {lookupError ? (
                      <p className="text-xs mt-1 text-red-500">{lookupError}</p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM RIGHT - Schedule */}
            <div className="border rounded-lg p-3.5">
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden">
                {/* Schedule Header */}
                <div className="grid grid-cols-3 bg-[#1C6100] text-white text-sm">
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Day
                  </span>
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Time
                  </span>
                  <span className="px-2 py-2 text-center">Subject</span>
                </div>
                {/* Empty Rows */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 text-sm h-8 items-center border-b border-[#D9D9D9]/50"
                  >
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 h-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
