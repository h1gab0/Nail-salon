// AdminCalendar.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CalendarContainer = styled.div`
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthNavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: ${({ theme }) => theme.colors.secondary};
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const CalendarCell = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 1rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  ${({ $isCurrentMonth, $isSelected, theme }) => `
    color: ${$isCurrentMonth ? theme.colors.text : theme.colors.secondary};
    ${$isSelected ? `
      background-color: ${theme.colors.primary};
      color: white;
    ` : ''}
  `}
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const AppointmentCount = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
    top: 2px;
    right: 2px;
  }
`;

const AvailabilityIndicator = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.7rem;
  @media (max-width: 768px) {
    font-size: 0.6rem;
    bottom: 2px;
    right: 2px;
  }
`;

const AdminCalendar = ({ appointments, onDaySelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentCount = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.filter(appointment => appointment.date === dateString).length;
  };

  const isDateAvailable = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dateAvailability = availability[dateString];
    return dateAvailability && dateAvailability.isAvailable && Object.values(dateAvailability.availableSlots).some(slot => slot);
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day) => {
    onDaySelect(day);
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavButton onClick={handlePrevMonth}><FaChevronLeft /></MonthNavButton>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <MonthNavButton onClick={handleNextMonth}><FaChevronRight /></MonthNavButton>
      </CalendarHeader>
      <CalendarGrid>
        {daysInMonth.map((day, index) => {
          const appointmentCount = getAppointmentCount(day);
          const isAvailable = isDateAvailable(day);
          return (
            <CalendarCell
              key={index}
              $isCurrentMonth={isSameMonth(day, currentDate)}
              $isSelected={selectedDate && isSameDay(day, selectedDate)}
              onClick={() => handleDayClick(day)}
            >
              {format(day, 'd')}
              {appointmentCount > 0 && (
                <AppointmentCount>{appointmentCount}</AppointmentCount>
              )}
              {isAvailable && (
                <AvailabilityIndicator>Available</AvailabilityIndicator>
              )}
            </CalendarCell>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default AdminCalendar;