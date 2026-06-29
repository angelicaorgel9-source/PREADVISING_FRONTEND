import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import back from "../assets/photo/arrow.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import next from "../assets/photo/next.png";

const PreAdvisingSections = () => {
  const [search, setSearch] = useState("");
  const [sections, setSections] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const yearLevel = location.state?.yearLevel ?? 1;
  const yearTitle = location.state?.yearTitle ?? `BSIT 1st Year`;
  const isIrregular = location.state?.irregular ?? false;

  useEffect(() => {
    if (isIrregular) {
      navigate('/pre-advising-list', { state: { irregular: true, yearTitle }, replace: true });
    }
  }, [isIrregular, navigate, yearTitle]);

  useEffect(() => {
    if (isIrregular) return;
    fetch(`/bridge/sections/${yearLevel}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((s) => ({
            name: s.name || s.section_name || s.section || "",
            active: s.active ?? false,
          }));
          setSections(mapped);
        }
      })
      .catch(() => {});
  }, [yearLevel, isIrregular]);

  const filteredSections = sections.filter((s) => (s.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full">

      {/* Header */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9]">

        <div className="flex flex-col items-start gap-1 text-[25px]">
          <Link to="/pre-advising">
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">Pre-Advising</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black/50">{yearTitle}</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black">Sections</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-65">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <div className="w-px h-5 bg-gray-400 mr-2"></div>
            <input
              type="text"
              placeholder="Search Section"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
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

      {/* Sections Grid */}
      <div className="p-6 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {filteredSections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl border border-[#D5D5D5] shadow-md w-57.25 h-62.75 cursor-pointer hover:shadow-lg transition-all duration-200">
              <Link to="/pre-advising-list" state={{ section: section.name, yearTitle, yearLevel }}>
                <div className={`px-4 py-3 ${section.active ? "bg-green-700 text-white rounded-t-2xl" : ""}`}>
                  <h3 className={`font-semibold ${section.active ? "text-white" : "text-gray-700"}`}>
                    {section.name}
                  </h3>
                  <p className={`text-sm ${section.active ? "text-white" : "text-gray-500"}`}>
                    No. of Students Enrolled
                  </p>
                </div>
              </Link>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="col-span-4 text-center py-10 text-gray-400 text-sm">
              No sections found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PreAdvisingSections;
