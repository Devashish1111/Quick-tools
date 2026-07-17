'use client';
import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';

export default function AgeCalculator() {
  const [birthdate, setBirthdate] = useState('');

  const age = useMemo(() => {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) return null;
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays };
  }, [birthdate]);

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div>
        <label className="qt-label flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Select Your Birthdate</label>
        <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="qt-input" style={{ colorScheme: 'light' }} />
      </div>
      {age && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: age.years, label: 'Years' }, { value: age.months, label: 'Months' },
            { value: age.days, label: 'Days' }, { value: age.totalDays.toLocaleString(), label: 'Total Days' },
          ].map(s => (
            <div key={s.label} className="qt-stat">
              <div className="qt-stat-value text-xl">{s.value}</div>
              <div className="qt-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
