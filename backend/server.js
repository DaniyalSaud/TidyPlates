import express from 'express';
import AccountRouter from './routes/account-router.js';

import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors()); // Use the cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/account', AccountRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port} \n IP: http://localhost:${port}`);
});