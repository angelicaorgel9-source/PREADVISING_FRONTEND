import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import back from "../../assets/photo/arrow.png";
import adminLogo from '../../dashboard/dashboardLOGO/adminLogo.png';
import next from "../../assets/photo/next.png";

const List = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const section     = location.state?.section ?? "";
  const isIrregular = location.state?.irregular ?? false;
  const yearLevel   = location.state?.yearLevel ?? 1;
  const yearTitle   = location.state?.yearTitle ?? "BSIT 1st Year";

  useEffect(() => {
    const url = isIrregular
      ? '/bridge/students/irregular'
      : section
        ? `/bridge/students/${section}`
        : '/bridge/students';

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const result = Array.isArray(data.data) ? data.data : data.data?.students ?? [];
          setStudents(result);
        }
      })
      .catch(() => {});
  }, [section, isIrregular]);

  const filteredStudents = students.filter(st =>
    (st.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (st.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (st.number || '').toString().includes(search)
  );

  
  const backTo    = isIrregular ? '/year-level' : '/section';
  const backState = isIrregular ? {} : { yearLevel, yearTitle };

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full">
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9]">
        <div className="flex flex-col items-start gap-1 text-[25px]">
          <Link to={backTo} state={backState}>
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            {isIrregular ? (
              <>
                <span className="font-bold text-black/50">Irregular Students</span>
                <img src={next} alt="Next" className="w-4 h-4 opacity-50" />
                <span className="font-bold text-black">Student</span>
              </>
            ) : (
              <>
                <span className="font-bold text-black/50">{yearTitle}</span>
                <img src={next} alt="Next" className="w-4 h-4 opacity-50" />
                <span className="font-bold text-black/50">Sections</span>
                <img src={next} alt="Next" className="w-4 h-4 opacity-50" />
                <span className="font-bold text-black">{section}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-1.5 w-60">
            <input
              type="text"
              placeholder="Search by name or student number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-xs w-full placeholder-gray-500"
            />
          </div>
          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>
      </div>

      <main className="px-8 py-6">
        <div className="flex px-4 mb-2 text-gray-700 font-semibold text-[16px]">
          <div className="w-1/4">Student Name</div>
          <div className="w-1/6 text-center">Section</div>
          <div className="w-1/3">Student Email</div>
          <div className="w-1/4 text-center">Student Number</div>
        </div>

        <div className="shadow-sm">
          <div className="overflow-y-auto">
            <div className="px-4 space-y-1">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st, idx) => (
                  <Link
                    key={idx}
                    to={`/viewGrade?id=${encodeURIComponent(st.number ?? st.student_no ?? st.student_number ?? st.id ?? '')}`}
                    state={{
                      student: st,
                      studentId: st.number ?? st.student_no ?? st.student_number ?? st.id ?? '',
                      from: 'list',
                      yearLevel,
                      yearTitle,
                      irregular: isIrregular,
                      source: isIrregular ? 'irregular' : 'list',
                    }}
                    className="block"
                  >
                    <div className="flex border bg-[#D9D9D9]/50 border-black hover:bg-gray-200 cursor-pointer h-6 items-center px-2 text-sm">
                      <div className="w-1/4">{st.name ?? '—'}</div>
                      <div className="w-1/6 text-center">{st.section ?? '—'}</div>
                      <div className="w-1/3">{st.email ?? st.email_address ?? '—'}</div>
                      <div className="w-1/4 text-center">{st.number ?? st.student_number ?? '—'}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <p className="text-sm font-semibold">No students found</p>
                  {search && (
                    <p className="text-xs mt-1">No results for "<span className="text-gray-600">{search}</span>"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default List;
