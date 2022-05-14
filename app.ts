import express from 'express';
import { routes } from './src/Routes';

const app = express();

routes(app);

app.listen(8080, () => {
  console.log('Listening on port: 8080')
});
