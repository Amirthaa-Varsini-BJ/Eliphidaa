import { useState, useMemo } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const styles = {
  semesterButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 8px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    textAlign: 'left',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    willChange: 'transform',
  },
  subjectButton: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    willChange: 'transform',
  },
  activeSubject: {
    backgroundColor: 'var(--accent-blue)',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
};

const SemestersSidebar = ({ setActiveSubject }) => {
  const [openSemester, setOpenSemester] = useState('Semester 1');
  const [localActiveSubject, setLocalActiveSubject] = useState('Core Subject 1A');

  const semesters = useMemo(() => ([
    { name: 'Semester 1', subjects: ['Core Subject 1A', 'Elective 1B', 'Lab Session 1C'] },
    { name: 'Semester 2', subjects: ['Core Subject 2A', 'Elective 2B', 'Lab Session 2C'] },
    { name: 'Semester 3', subjects: ['Core Subject 3A', 'Elective 3B', 'Lab Session 3C'] },
    { name: 'Semester 4', subjects: ['Core Subject 4A', 'Elective 4B', 'Lab Session 4C'] },
    { name: 'Semester 5', subjects: ['Core Subject 5A', 'Elective 5B', 'Lab Session 5C'] },
    { name: 'Semester 6', subjects: ['Core Subject 6A', 'Elective 6B', 'Lab Session 6C'] },
    { name: 'Semester 7', subjects: ['Core Subject 7A', 'Elective 7B', 'Lab Session 7C'] },
    { name: 'Semester 8', subjects: ['Core Subject 8A', 'Elective 8B', 'Lab Session 8C'] },
  ]), []);

  const handleSemesterClick = (semName) => {
    setOpenSemester(prev => (prev === semName ? null : semName));
  };

  const handleSubjectClick = (subject) => {
    setLocalActiveSubject(subject);
    if (setActiveSubject) {
      setActiveSubject(subject);
    }
  };

  return (
    <aside className="sidebar">
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', padding: '0 8px' }}>Semesters</h2>
      <ul style={{ listStyle: 'none' }}>
        {semesters.map((sem, index) => {
          const isOpen = openSemester === sem.name;

          return (
            <li key={index}>
              <button
                onClick={() => handleSemesterClick(sem.name)}
                style={{
                  ...styles.semesterButton,
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {sem.name}
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isOpen && (
                <ul style={{ listStyle: 'none', paddingLeft: '16px' }}>
                  {sem.subjects.map(subject => (
                    <li key={subject}>
                      <button
                        onClick={() => handleSubjectClick(subject)}
                        style={{
                          ...styles.subjectButton,
                          ...(localActiveSubject === subject ? styles.activeSubject : {}),
                        }}
                        onMouseEnter={e => {
                          if (localActiveSubject !== subject) {
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (localActiveSubject !== subject) {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {subject}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default SemestersSidebar;
