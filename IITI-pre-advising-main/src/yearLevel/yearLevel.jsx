import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import adminLogo from '../dashboard/dashboardLOGO/adminLogo.png';
import book from "../assets/photo/BOOK.png";

const years = [
  { name: "BSIT 1st Year",      yearLevel: 1 },
  { name: "BSIT 2nd Year",      yearLevel: 2 },
  { name: "BSIT 3rd Year",      yearLevel: 3 },
  { name: "BSIT 4th Year",      yearLevel: 4 },
  { name: "Irregular Students", yearLevel: null },
];

const YearLevel = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    
    const regularYears = years.filter(y => y.yearLevel !== null);

    const sectionPromises = regularYears.map(y =>
      fetch(`/bridge/sections/${y.yearLevel}`)
        .then(r => r.json())
        .then(data => ({ key: y.yearLevel, count: Array.isArray(data.data) ? data.data.length : (data.data?.length ?? 0) }))
        .catch(() => ({ key: y.yearLevel, count: 0 }))
    );

    const irregularPromise = fetch('/bridge/students/irregular')
      .then(r => r.json())
      .then(data => ({ key: 'irregular', count: Array.isArray(data.data) ? data.data.length : (data.data?.students?.length ?? 0) }))
      .catch(() => ({ key: 'irregular', count: 0 }));

    Promise.all([...sectionPromises, irregularPromise]).then(results => {
      const map = {};
      results.forEach(r => { map[r.key] = r.count; });
      setCounts(map);
    });
  }, []);

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full">
      <div className="p-5 pt-14 flex justify-between border-b-4 border-[#D9D9D9]">
        <h1 className="font-bold text-2xl p-5">Year Level</h1>
        <Link to="/profile">
          <div className="flex flex-col items-center cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      <main className="px-5 sm:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-255 mx-auto">
          {years.map((year, index) => (
            <Link
              key={index}
              to="/section"
              state={
                year.yearLevel === null
                  ? { irregular: true, yearTitle: year.name }
                  : { yearLevel: year.yearLevel, yearTitle: year.name }
              }
            >
              <div className="bg-[#1C6100] w-full h-41.25 rounded-[15px] p-5 relative text-white shadow-lg hover:bg-green-800 transition-all duration-300 cursor-pointer">
                <h2 className="text-[25px] font-bold">{year.name}</h2>
                <p className="text-[14px] font-normal mt-1 opacity-80">
                  {year.yearLevel === null ? `No. of Students: ${counts['irregular'] ?? 0}` : `No. of Sections: ${counts[year.yearLevel] ?? 0}`}
                </p>
                <img src={book} alt="Book" className="absolute bottom-4 right-4 w-10 h-10 object-contain" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default YearLevel;