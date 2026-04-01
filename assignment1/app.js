
import express from 'express';
const app = express();
const port = 3000;

app.get('/api/v1/cats', (req, res) => {
  res.json({
    cat_id: 1,
    name: "Murka",
    birthdate: "2020-05-10",
    weight: 4.2,
    owner: "Elena",
    image: "https://loremflickr.com/320/240/cat"
  });
});

app.use('/public', express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

