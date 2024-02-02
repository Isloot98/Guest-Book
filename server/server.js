import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fetch from 'node-fetch';


const PORT = '2020';
const app = express();
const db = new Database('database.db');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Ah yes, I see you've made a GET request");
   

});

app.get('/messages', (req, res) => {
    try {

        if (req.query.id) {
            let message = db.prepare(`SELECT * FROM messages WHERE id = ?`).all(req.query.id);
            res.status(200).json(message);
        }

        let messages = db.prepare(`SELECT * FROM messages`).all();
        res.status(200).json(messages);
    } catch (err) {
        console.error(err); 
        res.status(500).json(err);
    }
});


app.post('/messages', (req, res) => {
    try {
        const imgURL = req.body.imgURL;
        const message = req.body.message;
        const username = req.body.username;
        const newMessage = db.prepare(`INSERT INTO messages (message, username, imgURL) VALUES (?, ?, ?)`).run(message, username, imgURL);
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({error : err});;
    }
})


app.delete('/messages', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM messages').run();
        res.status(200).json({ message: 'All messages deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/messages/:id', (req, res) => {
    try {

        const id = req.params.id;

        const result = db.prepare(`DELETE FROM messages WHERE id = '${id}'`).run();
        res.status(200).json({ message: 'All messages deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/search', async (req, res) => {
    const { query } = req.query;
    console.log(query);
    console.log(req)
    const giphyAPIkey = 'RHFaqXbL0U0VqeqdUcz53JubHXR2SNS1';
  
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyAPIkey}&q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
  
    //   const result = db.prepare('INSERT OR REPLACE INTO messages (imgURL) VALUES (?)');
    //   data.data.forEach(gif => {
    //     result.run(gif.images.original.imgURL);
    //   });
  
      res.json(data.data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(PORT, () => {
    console.log("Ah yes, the server is listening");
})

