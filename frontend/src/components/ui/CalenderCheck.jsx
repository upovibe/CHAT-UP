import { useState } from 'react';
import { Calendar1Icon } from 'lucide-react';

const CalenderCheck = () => {
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setDate((prevDate) => {
      const updatedDate = new Date(prevDate);
      updatedDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      return updatedDate;
    });
  };

  const handleTimeChange = (event) => {
    const [hours, minutes] = event.target.value.split(':');
    setDate((prevDate) => {
      const updatedDate = new Date(prevDate);
      updatedDate.setHours(hours, minutes);
      return updatedDate;
    });
  };

  return (
    <div>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-blue-600 font-bold transition-all ease-linear duration-200"
        >
          <Calendar1Icon />
        </button>
        {isOpen && (
          <div className="absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 right-0">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                value={date.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="rounded-md border shadow p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Time</label>
              <input
                type="time"
                value={date.toTimeString().substring(0, 5)}
                onChange={handleTimeChange}
                className="rounded-md border shadow p-2 w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalenderCheck;
