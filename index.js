$(document).ready(function() {
  const table = $('#employees-table').DataTable({
      language: {
          url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Polish.json'
      },
      columnDefs: [
          { targets: [0], visible: false },
          { targets: [6], render: $.fn.dataTable.render.number(',', '.', 2, 'PLN') }
      ],
      order: [[ 2, 'asc' ]],
      paging: true
  });

  function saveEmployeesToJson(employees) {
      const jsonData = JSON.stringify(employees);
      const serverUrl = 'http://localhost:3000/';

    $.ajax({
        url: serverUrl + 'save-employees',
        type: 'POST',
        data: jsonData,
        contentType: 'application/json; charset=utf-8',
        success: function() {
            console.log('Plik JSON został zapisany pomyślnie.');
        },
        error: function(error) {
            console.error('Błąd podczas zapisywania pliku:', error);
        }
    });
  }

  $('#employee-form').submit(function(e) {
      e.preventDefault();

      const employee = {
          first_name: $('#first-name').val(),
          last_name: $('#last-name').val(),
          position: $('#position').val(),
          branch: $('#branch').val(),
          start_date: $('#start-date').val(),
          salary: parseFloat($('#salary').val())
      };

      table.row.add([
          table.data().count() + 1,
          employee.first_name,
          employee.last_name,
          employee.position,
          employee.branch,
          employee.start_date,
          employee.salary,
          '<button class="btn btn-primary edit-button">Edytuj</button><button class="btn btn-danger delete-button">Usuń</button>'
      ]).draw(false);

      const employees = table.rows().data().toArray().map(function(row) {
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

      saveEmployeesToJson(employees);

      $('#employee-form')[0].reset();
  });

  $('#employees-table').on('click', '.edit-button', function() {
      const data = table.row($(this).closest('tr')).data();
      const employeeId = data[0];

      // TODO: Implement edit functionality
      console.log('Edit employee with ID:', employeeId);
  });

  $('#employees-table').on('click', '.delete-button', function() {
      const data = table.row($(this).closest('tr')).data();
      const employeeId = data[0];

      table.row($(this).closest('tr')).remove().draw(false);

      // TODO: Implement delete functionality
      console.log('Delete employee with ID:', employeeId);
  });

  $('#export-csv').click(function() {
      const csvData = table.rows().data().toArray().map(function(row) {
          return row.slice(1, row.length - 1).join(';');
      }).join('\n');

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });
});