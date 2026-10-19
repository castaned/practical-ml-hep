// Google Apps Script, executed as the sheet owner. Never publish the sheet itself.
const SHEET_ID = '1Bg-fwwj3Lxm3iRCQGzOcIHAbl4OHoVv12B9ttB509-Q';
function normalizeName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim().replace(/\s+/g, ' ').toLowerCase();
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function lookupAccount(rows, name) {
  const key = normalizeName(name);
  if (key.length < 3 || key.length > 160) return {error:'Escribe tu nombre y apellido.'};
  const matches = rows.filter(row => normalizeName(row[1]) === key && /^estudiante_\d+$/.test(String(row[2]).trim()));
  if (matches.length !== 1) return {error: matches.length ? 'Hay más de una coincidencia. Consulta al instructor.' : 'No encontramos una cuenta con ese nombre. Revisa cómo está escrito o consulta al instructor.'};
  const row = matches[0];
  if (!row[3]) return {error:'La cuenta aún no tiene contraseña asignada. Consulta al instructor.'};
  return {username:String(row[2]).trim(), password:String(row[3])};
}
function doPost(e) {
  let result;
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Cuentas Yuca');
    const rows = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,4).getDisplayValues() : [];
    result = lookupAccount(rows, e && e.parameter && e.parameter.name);
  } catch (_) { result = {error:'No se pudo consultar la asignación. Intenta de nuevo o consulta al instructor.'}; }
  const body = result.error ? '<p>'+escapeHtml(result.error)+'</p>' :
    '<p><strong>Usuario:</strong> <code>'+escapeHtml(result.username)+'</code></p><p><strong>Contraseña:</strong> <code>'+escapeHtml(result.password)+'</code></p>';
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta charset="utf-8"><style>body{font:17px Arial,sans-serif;color:#193148;padding:12px}code{font-size:18px;overflow-wrap:anywhere}</style>'+body+'</html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doGet() {
  return HtmlService.createHtmlOutput('Consulta tu cuenta desde la página de Preparación del taller.');
}
