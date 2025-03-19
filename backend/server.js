import express from 'express';
import SignUpRouter from './routes/signup-router.js';
import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors()); // Use the cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
    
app.use('/signup/account', SignUpRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});