/**
 * Origin Talent — Sheets management dashboard.
 *
 * Adds a "Dashboard" tab to each of the two live form-destination spreadsheets
 * (Client Staffing Enquiries and Candidate Applications) plus a "Status"
 * tracking column on each data sheet, so Roger can manage submissions without
 * leaving Google Sheets.
 *
 * INSTALL (one-time, manual — editing this file in the repo does NOT deploy it):
 *   1. Open the Apps Script project that already hosts sheets-bridge.gs
 *      (Extensions > Apps Script from either sheet), or any project with
 *      access to both spreadsheets.
 *   2. Add a new script file, paste this whole file in, and save.
 *   3. Run buildDashboards() once from the editor (authorize when prompted).
 *   4. Re-run buildDashboards() any time to refresh formulas — it is
 *      idempotent and never touches submission data, only the Dashboard tab
 *      and the Status column header/validation.
 *
 * The Status column is safe for the form bridge: sheets-bridge.gs maps
 * incoming fields to columns by header name, so an extra "Status" header is
 * simply left blank on new rows.
 *
 * Client Staffing Enquiries sheet: https://docs.google.com/spreadsheets/d/1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI/edit
 * Candidate Applications sheet:    https://docs.google.com/spreadsheets/d/19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM/edit
 */

var DASHBOARD_TARGETS = [
  {
    label: 'Client Staffing Enquiries',
    sheetId: '1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI',
    roleColumn: 'Role Needed',
    nameColumn: 'Full Name',
    statuses: ['New', 'Contacted', 'Shortlisting', 'Placed', 'Closed']
  },
  {
    label: 'Candidate Applications',
    sheetId: '19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM',
    roleColumn: 'Role Applying For',
    nameColumn: 'Full Name',
    statuses: ['New', 'Screening', 'Interviewing', 'Placed', 'Declined']
  }
];

function buildDashboards() {
  DASHBOARD_TARGETS.forEach(buildDashboardFor_);
}

function buildDashboardFor_(target) {
  var ss = SpreadsheetApp.openById(target.sheetId);
  var data = ss.getSheets()[0];
  var dataName = data.getName();
  var headers = data.getRange(1, 1, 1, data.getLastColumn()).getValues()[0];

  // --- Status column: append once, with dropdown validation on the data rows ---
  var statusCol = headers.indexOf('Status') + 1;
  if (!statusCol) {
    statusCol = headers.length + 1;
    data.getRange(1, statusCol).setValue('Status').setFontWeight('bold');
  }
  var statusRange = data.getRange(2, statusCol, Math.max(data.getMaxRows() - 1, 1), 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(target.statuses, true)
      .setAllowInvalid(true)
      .build()
  );

  var roleCol = columnLetter_(headers.indexOf(target.roleColumn) + 1);
  var nameCol = columnLetter_(headers.indexOf(target.nameColumn) + 1);
  var submittedCol = columnLetter_(headers.indexOf('Submitted At') + 1);
  var statusLetter = columnLetter_(statusCol);
  var q = function (col) { return "'" + dataName + "'!" + col + '2:' + col; };

  // --- Dashboard tab, rebuilt from scratch each run ---
  var dash = ss.getSheetByName('Dashboard');
  if (dash) dash.clear();
  else dash = ss.insertSheet('Dashboard', 0);

  var rows = [
    [target.label + ' — Dashboard', ''],
    ['Refreshed by buildDashboards() on', new Date()],
    ['', ''],
    ['Total submissions', '=COUNTA(' + q(nameCol) + ')'],
    // Submitted At holds ISO-8601 text (from the bridge), which sorts/compares lexicographically
    ['Last 7 days', '=COUNTIF(' + q(submittedCol) + ',">="&TEXT(TODAY()-7,"yyyy-mm-dd"))'],
    ['Last 30 days', '=COUNTIF(' + q(submittedCol) + ',">="&TEXT(TODAY()-30,"yyyy-mm-dd"))'],
    ['Awaiting action (no status yet)', '=COUNTIFS(' + q(nameCol) + ',"<>",' + q(statusLetter) + ',"")'],
    ['', ''],
    ['By status', 'Count']
  ];
  target.statuses.forEach(function (s) {
    rows.push([s, '=COUNTIF(' + q(statusLetter) + ',"' + s + '")']);
  });
  rows.push(['', '']);
  rows.push(['By role', 'Count']);

  dash.getRange(1, 1, rows.length, 2).setValues(rows);

  // role breakdown as a live QUERY so new roles appear without re-running
  var roleAnchor = rows.length + 1;
  dash.getRange(roleAnchor, 1).setFormula(
    '=IFERROR(QUERY(' + q(roleCol) + ',"select Col1, count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc label count(Col1) \'\'",0),"No submissions yet")'
  );

  // latest 10 submissions
  var latestAnchor = roleAnchor + 14;
  dash.getRange(latestAnchor, 1, 1, 2).setValues([['Latest 10 submissions', '']]);
  dash.getRange(latestAnchor + 1, 1).setFormula(
    '=IFERROR(QUERY({' + q(submittedCol) + ',' + q(nameCol) + ',' + q(roleCol) + ',' + q(statusLetter) + '},' +
    '"select * where Col2 is not null order by Col1 desc limit 10",0),"No submissions yet")'
  );

  // presentation
  dash.getRange(1, 1).setFontWeight('bold').setFontSize(13);
  [9, rows.length, latestAnchor].forEach(function (r) {
    dash.getRange(r, 1, 1, 2).setFontWeight('bold');
  });
  dash.setColumnWidth(1, 260);
  dash.setColumnWidth(2, 180);
  dash.setFrozenRows(1);
}

function columnLetter_(col) {
  var letter = '';
  while (col > 0) {
    var rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}
