/**
 * Origin Talent — form-to-Sheets bridge.
 * Deploy this as a Web App (Extensions > Apps Script in either Sheet, paste this file,
 * replace the two IDs below, then Deploy > New deployment > type "Web app",
 * execute as "Me", access "Anyone"). Copy the resulting /exec URL into the site's
 * form JS as the fetch() target for each form's `formType` value.
 *
 * Client Staffing Enquiries sheet: https://docs.google.com/spreadsheets/d/1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI/edit
 * Candidate Applications sheet:    https://docs.google.com/spreadsheets/d/19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM/edit
 */

var SHEET_IDS = {
  client: '1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI',
  candidate: '19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM'
};

// Columns that must stay literal text — Sheets otherwise parses them as
// numbers and silently strips the leading zero every SA phone/ID starts with.
var FORCE_TEXT_COLUMNS = ['Mobile', 'Alt Phone', 'Next of Kin Number', 'ID Number'];

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'error', message: 'This endpoint only accepts POST requests from the site forms.' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // e.postData is only populated on a real HTTP POST (i.e. from the live site).
  // Running doPost manually from the editor, or opening this URL in a browser, has no e.postData.
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: 'No request body received. This function is meant to be called by the site’s forms, not run directly.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var data = JSON.parse(e.postData.contents);
  var sheetId = SHEET_IDS[data.formType];
  if (!sheetId) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown formType' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  var row = headers.map(function (header) {
    if (header === 'Submitted At') return new Date().toISOString();
    return data[header] || '';
  });

  var newRowIndex = sheet.getLastRow() + 1;

  // Set text format on the force-text columns BEFORE writing values, so
  // Sheets never gets the chance to reinterpret "0821234567" as the number 821234567.
  headers.forEach(function (header, i) {
    if (FORCE_TEXT_COLUMNS.indexOf(header) !== -1) {
      sheet.getRange(newRowIndex, i + 1).setNumberFormat('@');
    }
  });

  sheet.getRange(newRowIndex, 1, 1, row.length).setValues([row]);

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
