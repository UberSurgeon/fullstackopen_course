import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();

app.get('/hello', (_req,res) => {
    res.send("Hello Full Stack!");
});

app.get('/bmi', (req, res) => {
    try{
        const result = {
            "weight": req.query.weight,
            "height": req.query.height,
            bmi: calculateBmi(Number(req.query.height), Number(req.query.weight))
        };
        res.json(JSON.stringify(result));
    } catch(error) {
        if (error instanceof Error){
            console.log(error.message);
            res.json(JSON.stringify({
                error: "malformatted parameters"
            }));
        }
    }

    
});

app.get('/webexercises', (req, res) => {
    try{
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const dailyHour = String(req.query.daily_exercises);
        const target = req.query.target;
        if (!dailyHour && !target) {
            throw new Error('parameters missing');
        }
        const input = dailyHour.replace('[', '').replace(']','').replace(/\s/g, "").split(',').map((n: string) => Number(n)).filter(Number.isFinite);
        res.json(JSON.stringify(calculateExercises(input, Number(target))));
        
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json(JSON.stringify({
                error: "malformatted parameters"
            }));
        }
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}`);
});


