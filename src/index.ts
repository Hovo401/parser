import express from 'express';
import mainRouter from './routers/main.router.js';


const app = express();
app.use(mainRouter);

const PORT = Number(process.env.PORT) || 3000;



try{  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}catch(e){
  console.error(e);
}