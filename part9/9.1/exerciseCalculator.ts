interface TargetValue{
    periodLength: number,
    trainingDays: number,
    target: number,
    average: number,
    success: boolean,
    rating: 1 | 2 | 3,
    ratingDescription: string
}

const calculateExercises = (dailyHour: number[], targetAmount: number): TargetValue => {
    const sum = dailyHour.reduce((p,c) => p + c, 0);
    const avg = sum / dailyHour.length;
    let rating: 1 | 2 | 3;
    let ratingDescription: string;
    if (avg >= targetAmount){
        rating = 3;
        ratingDescription = "perfect";
    } else if (avg >= targetAmount-0.5){
        rating = 2;
        ratingDescription = "not too bad but could be better";
    } else {
        rating = 1;
        ratingDescription = "bad";
    }

    return {
        periodLength: dailyHour.length,
        trainingDays: dailyHour.filter(h => h > 0).length,
        success:dailyHour.length === dailyHour.filter(h => h > 0).length? true : false,
        rating,
        ratingDescription,
        target: targetAmount,
        average: avg
    };

};


if(require.main === module){
    const input = process.argv.map((n: string) => Number(n)).filter(Number.isFinite);
    const target = input.splice(0, 1);


    console.log(calculateExercises(input, target[0]));
}

export default calculateExercises;
