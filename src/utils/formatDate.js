export const formatTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minuite: "2-digit",
      hour12: true,
    });
  };