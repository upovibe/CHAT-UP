// Helper function for Date Separator formatting
export const formatDateSeparator = (dateString, previousDateString) => {
  const currentDate = new Date(dateString);
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  // Within the same week
  if (currentDate >= oneWeekAgo && currentDate <= now) {
    return currentDate.toLocaleDateString([], { weekday: "long" }); // e.g., "Tuesday"
  }

  // Within the same month
  if (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() === now.getMonth()) {
    return currentDate.toLocaleDateString([], { weekday: "long", month: "long" }); // e.g., "Tuesday, December"
  }

  // Within the same year
  if (currentDate.getFullYear() === now.getFullYear()) {
    return currentDate.toLocaleDateString([], { month: "long" }); // e.g., "December"
  }

  // Outside the current year
  return currentDate.toLocaleDateString([], { month: "long", year: "numeric" }); // e.g., "December 2020"
};


// Helper function for Message Timestamps
export const formatMessageTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


// utils/dataFormat.js
export const isNewDay = (currentMessageDate, previousMessageDate) => {
  const currentDate = new Date(currentMessageDate).setHours(0, 0, 0, 0);
  const previousDate = new Date(previousMessageDate).setHours(0, 0, 0, 0);
  return currentDate > previousDate;
};
