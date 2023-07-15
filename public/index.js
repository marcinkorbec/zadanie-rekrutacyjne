$(document).ready(function() {
    const table = $('#employees-table').DataTable({
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Polish.json'
      },
      columnDefs: [
        { targets: [0], visible: false },
        { targets: [6], render: $.fn.dataTable.render.number(',', '.', 2, 'PLN') }
      ],
      order: [[2, 'asc']],
      paging: true
    });

    // Ukrywanie widoków na początku
    $('#add-employee-view').hide();
    $('#list-employees-view').hide();

    // Wyświetlanie widoku formularza po kliknięciu w link
    $('#add-employee-link').click(function() {
        $('#list-employees-view').hide();
        $('#introduction-view').hide();
        $('#add-employee-view').show();
    });

    // Wyświetlanie widoku listy pracowników po kliknięciu w link
    $('#list-employees-link').click(function() {
        $('#add-employee-view').hide();
        $('#introduction-view').hide();
        $('#list-employees-view').show();
    });

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
          '<i class="fas fa-edit edit-button"></i><i class="fas fa-trash delete-button"></i>'
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

  async function loadEmployeesFromServer() {
    const serverUrl = 'http://localhost:3000/';

    try {
      const response = await fetch(serverUrl + 'get-employees');
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych');
      }

      const data = await response.json();
      table.clear();

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          table.row.add([
            data[i].id,
            data[i].first_name,
            data[i].last_name,
            data[i].position,
            data[i].branch,
            data[i].start_date,
            data[i].salary,
            '<i class="fas fa-edit edit-button"></i><i class="fas fa-trash delete-button"></i>'
          ]);
        }
      }

      table.draw(false);
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  }

  loadEmployeesFromServer();

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