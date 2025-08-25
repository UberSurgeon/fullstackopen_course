import express from 'express';
import calculateBmi from './bmiCalculator';

const app = express();

app.get('/hello', (_req,res) => {
    res.send("Hello Full Stack!")
})

app.get('/bmi', (req, res) => {
    try{
        const result = {
            "weight": req.query.weight,
            "height": req.query.height,
            bmi: calculateBmi(Number(req.query.height), Number(req.query.weight))
        }
        res.json(JSON.stringify(result))
    } catch(error) {
        if (error instanceof Error){
            console.log(error.message)
            res.json(JSON.stringify({
                error: "malformatted parameters"
            }))
        }
    }

    
})

const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}`)
})


