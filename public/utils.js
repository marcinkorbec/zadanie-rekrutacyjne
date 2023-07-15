function getEmployeesFromTable(table) {
  return table.rows().data().toArray().map(function (row) {
    return {
      id: row[0],
      first_name: row[1],
      last_name: row[2],
      position: row[3],
      branch: row[4],
      start_date: row[5],
      salary: row[6]
    };
  });
}

function saveEmployeesToJson(table) {
  const employees = getEmployeesFromTable(table);
  const jsonData = JSON.stringify(employees);
  const serverUrl = '/';

  $.ajax({
    url: serverUrl + 'save-employees',
    type: 'POST',
    data: jsonData,
    contentType: 'application/json; charset=utf-8',
    success: function () {
      console.log('Plik JSON został zapisany pomyślnie.');
    },
    error: function (error) {
      console.error('Błąd podczas zapisywania pliku:', error);
    }
  });
}

function updateTableAndSave(table) {
  table.draw(false);
  saveEmployeesToJson(table);
}