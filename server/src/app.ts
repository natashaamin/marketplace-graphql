import express from 'express';

const App = () => {
    const app = express();
    app.use(express.json());

    app.get('/api/v1/hello', async(req, res, next) => {
        res.send('success')
    })

    return app;
}

export default App