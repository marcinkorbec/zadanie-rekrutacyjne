$(document).ready(function () {
  const table = $('#employees-table').DataTable({
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Polish.json'
    },
    columnDefs: [
      {targets: [0], visible: false},
      {targets: [6], render: $.fn.dataTable.render.number(',', '.', 2, 'PLN')}
    ],
    order: [[2, 'asc']],
    paging: true
  });

  // Ukrywanie widoków na początku
  $('#add-employee-view').hide();
  $('#list-employees-view').hide();
  $('#edit-employee-view').hide();

  // Wyświetlanie widoku formularza po kliknięciu w link
  $('#add-employee-link').click(function () {
    $('#list-employees-view').hide();
    $('#introduction-view').hide();
    $('#edit-employee-view').hide();
    $('#add-employee-view').show();
  });

  // Wyświetlanie widoku listy pracowników po kliknięciu w link
  $('#list-employees-link').click(function () {
    $('#add-employee-view').hide();
    $('#introduction-view').hide();
    $('#edit-employee-view').hide();
    $('#list-employees-view').show();
  });

  $('.hamburger-button').click(function () {
    $('.hamburger-menu').toggleClass('open');
  });

  $(document).ready(function () {
    $('.navbar-toggler').click(function () {
      const logoLink = $('#logo-link');
      if (logoLink.css('display') !== 'none') {
        logoLink.css('display', 'none');
      } else {
        logoLink.css('display', '');
      }
    });
  });

  $('#employee-form').submit(function (e) {
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
    ]);

    updateTableAndSave(table);
    $('#employee-form')[0].reset();
  });

  async function loadEmployeesFromServer() {
    const serverUrl = '/';

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

      updateTableAndSave(table);
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  }

  loadEmployeesFromServer();

  $('#employees-table').on('click', '.edit-button', function () {
    const data = table.row($(this).closest('tr')).data();
    const employeeId = data[0];

    // Pobierz dane z wybranego wiersza
    const firstName = data[1];
    const lastName = data[2];
    const position = data[3];
    const branch = data[4];
    const startDate = data[5];
    const salary = data[6];

    // Wypełnij formularz edycji danymi z wybranego użytkownika
    $('#edit-employee-id').val(employeeId);
    $('#edit-first-name').val(firstName);
    $('#edit-last-name').val(lastName);
    $('#edit-position').val(position);
    $('#edit-branch').val(branch);
    $('#edit-start-date').val(startDate);
    $('#edit-salary').val(salary);

    // Wyświetl formularz edycji
    $('#edit-employee-view').show();
    $('#list-employees-view').hide();
  });

  $('#edit-employee-form').submit(function (e) {
    e.preventDefault();

    // Pobierz zmienione dane z formularza edycji
    const employeeId = $('#edit-employee-id').val();
    const firstName = $('#edit-first-name').val();
    const lastName = $('#edit-last-name').val();
    const position = $('#edit-position').val();
    const branch = $('#edit-branch').val();
    const startDate = $('#edit-start-date').val();
    const salary = $('#edit-salary').val();

    // Zaktualizuj dane w tabeli
    const rowIndex = table.row('#row-' + employeeId).index();
    table.cell(rowIndex, 1).data(firstName);
    table.cell(rowIndex, 2).data(lastName);
    table.cell(rowIndex, 3).data(position);
    table.cell(rowIndex, 4).data(branch);
    table.cell(rowIndex, 5).data(startDate);
    table.cell(rowIndex, 6).data(salary);

    updateTableAndSave(table);

    // Wyświetl widok tabeli
    $('#add-employee-view').hide();
    $('#edit-employee-view').hide();
    $('#list-employees-view').show();
  });

  // Usunięcie wiersza po kliknięciu przycisku "Usuń"
  $('#employees-table').on('click', '.delete-button', function () {
    const data = table.row($(this).closest('tr')).data();
    const employeeId = data[0];

    table.row($(this).closest('tr')).remove();

    updateTableAndSave(table);

    // Wyświetlenie widoku tabeli
    $('#add-employee-view').hide();
    $('#edit-employee-view').hide();
    $('#list-employees-view').show();
  });

  // export do CSV
  $('#export-csv').click(function () {
    const csvData = table.rows().data().toArray().map(function (row) {
      return row.slice(1, row.length - 1).join(';');
    }).join('\n');

    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
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