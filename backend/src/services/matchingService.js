const pool = require('../config/database');

const calculateMatchScore = (lostReport, foundReport) => {
  let score = 0;
  const details = {};

  // Document number match (50 points)
  if (lostReport.document_number && foundReport.document_number) {
    if (lostReport.document_number === foundReport.document_number) {
      score += 50;
      details.documentNumberMatch = true;
    }
  }

  // Owner name match (30 points)
  if (lostReport.owner_name && foundReport.owner_name) {
    const similarity = stringSimilarity(lostReport.owner_name.toLowerCase(), foundReport.owner_name.toLowerCase());
    if (similarity > 0.8) {
      score += 30;
      details.nameMatch = true;
    }
  }

  // Document type match (20 points)
  if (lostReport.document_type === foundReport.document_type) {
    score += 20;
    details.documentTypeMatch = true;
  }

  return { score, details };
};

const stringSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / longer.length;
};

const editDistance = (str1, str2) => {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
};

const findMatches = async (foundReportId) => {
  const foundResult = await pool.query('SELECT * FROM found_reports WHERE id = $1', [foundReportId]);
  const foundReport = foundResult.rows[0];

  const lostReports = await pool.query("SELECT * FROM lost_reports WHERE status = 'active'");
  
  const matches = [];
  for (const lostReport of lostReports.rows) {
    const { score, details } = calculateMatchScore(lostReport, foundReport);
    if (score >= 50) {
      matches.push({
        lostReportId: lostReport.id,
        foundReportId,
        score,
        details
      });
    }
  }

  return matches;
};

module.exports = { findMatches, calculateMatchScore };
