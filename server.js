const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

app.get('/get-employees', async (req, res) => {
  const filePath = path.join(__dirname, 'data', 'employees.json');

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (err) {
    console.error('Błąd podczas odczytu pliku:', err);
    res.status(500).json({error: 'Błąd podczas odczytu pliku'});
  }
});

app.post('/save-employees', (req, res) => {
  const jsonData = JSON.stringify(req.body);
  const filePath = path.join(__dirname, 'data', 'employees.json');

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('Błąd podczas zapisywania pliku:', err);
      res.status(500).json({error: 'Błąd podczas zapisywania pliku'});
    } else {
      console.log('Plik JSON został zapisany pomyślnie.');
      res.json({message: 'Plik JSON został zapisany pomyślnie'});
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Serwer nasłuchuje na porcie 3000!');
});