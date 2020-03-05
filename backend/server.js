import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from'cors';
import { createServer } from 'http';

const app = express();
const port = 4000

fetch('https://upheave.tech/api/meals.php')
  .then(response => response.json())
  .then(data => {
    app.get('/api', cors(), function(req, res) {
      res.send({data})
    })
    
    const server = createServer(app);
    
    server.listen(port, () => console.log('LISTENING ON PORT:' + port ));
  })

