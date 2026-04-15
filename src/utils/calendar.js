// src/utils/calendar.js
export function generateICS(session) {
  if (!session) return;

  const now = new Date();
  
  // Create a start date (today with session time)
  // Time comes in like "09:00 AM - 10:00 AM"
  const parts = session.time.split(' - ');
  const startTimeStr = parts[0];
  const endTimeStr = parts[1] || startTimeStr;

  const parseTime = (timeStr) => {
    const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return { h: 0, m: 0 };
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return { h, m };
  };

  const start = parseTime(startTimeStr);
  const end = parseTime(endTimeStr);

  const startDate = new Date();
  startDate.setHours(start.h, start.m, 0);

  const endDate = new Date();
  endDate.setHours(end.h, end.m, 0);

  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MeetFlow AI Event Concierge//EN',
    'BEGIN:VEVENT',
    `UID:${session.id}-${Date.now()}@meetflow.ai`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${session.title}`,
    `LOCATION:${session.location}`,
    `DESCRIPTION:${session.description} - Speaker: ${session.speaker || 'TBA'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${session.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
