function projectDuration(start, end) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  // Pastikan tanggal valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }
  
  const diffTime = endDate - startDate;
  let diffDays = diffTime / msPerDay;
  
  // Jika project berlangsung kurang dari satu hari (tetapi masih sama hari), hitung sebagai 1 hari.
  if (diffDays < 1) {
    diffDays = 1;
  } else {
    diffDays = Math.ceil(diffDays);
  }
  
  return diffDays;
}

module.exports = { projectDuration };
