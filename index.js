import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('GEMINI_API:', process.env.GEMINI_API);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: process.env.Gemini_model });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.post('/api/chat', async (req, res) => {

    const userPrompt = req.body.message;

  if (!userPrompt || userPrompt.trim() === '') {
    console.log('Error: prompt kosong');
    return res.status(400).json({ error: 'Isi prompt aku dong!' });
  }

  try {
    const result = await model.generateContent(userPrompt);
    const response =await result.response
    const text = response.text();

    res.json ({
      reply: text,  
    })
  } catch (error) {
    error.message = 'Error generating content: ' + error.message;
    console.error(error)
    res.status(500).json({
      error: error.message,
    });
  }

})