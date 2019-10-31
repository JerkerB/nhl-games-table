import React, { useRef } from 'react';
import { formatDate, parseDate } from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const DateRange = ({ fromDate, toDate, onFromDayChange, onToDayChange }) => {
  const toEl = useRef(null);
  const modifiers = { start: fromDate, end: toDate };

  return (
    <div>
      <DayPickerInput
        value={fromDate}
        format="LL"
        formatDate={formatDate}
        parseDate={parseDate}
        onDayChange={onFromDayChange}
        dayPickerProps={{
          selectedDays: [fromDate, { from: fromDate, to: toDate }],
          disabledDays: { after: toDate },
          toMonth: toDate,
          modifiers,
          onDayClick: () => toEl.current.getInput().focus()
        }}
      />
      {' — '}
      <DayPickerInput
        ref={toEl}
        value={toDate}
        format="LL"
        formatDate={formatDate}
        parseDate={parseDate}
        onDayChange={onToDayChange}
        dayPickerProps={{
          selectedDays: [fromDate, { from: fromDate, to: toDate }],
          disabledDays: { before: fromDate },
          modifiers,
          month: fromDate,
          fromMonth: fromDate
        }}
      />
    </div>
  );
};

export default DateRange;
