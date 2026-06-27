import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import book from "../assets/photo/BOOK.png";

const defaultLevels = [
  { year_level: 1, name: "BSIT 1st Year", section_count: 0 },
  { year_level: 2, name: "BSIT 2nd Year", section_count: 0 },
  { year_level: 3, name: "BSIT 3rd Year", section_count: 0 },
  { year_level: 4, name: "BSIT 4th Year", section_count: 0 },
  { year_level: "irregular", name: "Irregular Students", student_count: 0 },
];

const PreAdvising = () => {
  const [yearLevels, setYearLevels] = useState([]);

  useEffect(() => {
    fetch("/bridge/year-levels")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setYearLevels(Array.isArray(data.data) ? data.data : []);
        }
      })
      .catch(() => {
        setYearLevels([]);
      });
  }, []);

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full">

      {/* HEADER */}
      <div className="p-5 pt-14 flex justify-between border-b-4 border-[#D9D9D9] bg-gray-100">
        <h1 className="font-bold text-2xl p-5">Pre-Advising</h1>

        <Link to="/profile">
          <div className="flex flex-col items-center cursor-pointer active:scale-95 transition">
            <img
              src={adminLogo}
              alt="admin"
              className="h-10.5 w-10.5"
            />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      {/* CONTENT */}
      <main className="px-5 sm:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-255 mx-auto">
          {(yearLevels.length > 0 ? yearLevels : defaultLevels)
            .slice()
            .sort((a, b) => {
              const aIrregular = a.year_level === "irregular";
              const bIrregular = b.year_level === "irregular";
              if (aIrregular !== bIrregular) return aIrregular ? 1 : -1;
              if (typeof a.year_level === "number" && typeof b.year_level === "number") {
                return a.year_level - b.year_level;
              }
              return String(a.year_level).localeCompare(String(b.year_level));
            })
            .map((item, index) => {
              const isIrregular = item.year_level === "irregular";
              const countLabel = isIrregular
                ? `No. of Students: ${item.student_count ?? 0}`
                : `No. of Sections: ${item.section_count ?? 0}`;

              return (
                <Link
                  to="/pre-advising-list"
                  state={
                    isIrregular
                      ? { irregular: true, yearTitle: item.name }
                      : { yearTitle: item.name }
                  }
                  key={index}
                  className="block"
                >
                  <div className="bg-[#1C6100] w-full h-41.25 rounded-[15px] p-5 relative text-white shadow-lg hover:bg-green-800 transition-all duration-300 cursor-pointer">
                    <h2 className="text-[25px] font-bold">{item.name}</h2>
                    <p className="text-[14px] mt-1 opacity-80">{countLabel}</p>
                    <img
                      src={book}
                      alt="book"
                      className="absolute bottom-4 right-4 w-10 h-10 object-contain"
                    />
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default PreAdvising;