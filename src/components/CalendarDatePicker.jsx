import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import styles from './CalendarDatePicker.module.css';

export default function CalendarDatePicker({ onSelect }) {
  const [selected, setSelected] = useState();

  const handleSelect = (day) => {
    setSelected(day);
    if (onSelect) onSelect(day);
  };

  return (
    <div className={styles.calendar}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        className={styles.dayPicker}
        components={{
          Chevron: ({ orientation, ...props }) => (
            <button {...props} className={styles.chevron}>
              {orientation === 'left' ? '‹' : '›'}
            </button>
          ),
        }}
      />
    </div>
  );
}
