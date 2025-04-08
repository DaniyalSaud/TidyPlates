import express from 'express';
import SignUpRouter from './routes/signup-router.js';
import LoginRouter from './routes/login-router.js';
import DeleteRouter from './routes/delete-router.js';
import DashboardRouter from './routes/dashboard-router.js';

import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors()); // Use the cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
    
app.use('/account/signup', SignUpRouter);
app.use('/account/login', LoginRouter);
app.use('/account/delete', DeleteRouter);
app.use('/account/dashboard', DashboardRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});