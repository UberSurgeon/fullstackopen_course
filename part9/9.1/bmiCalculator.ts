const calculateBmi = (height: number, weight: number): String => {
    const h = height/100
    const BMI = weight / (h * h);
    if (BMI >= 18.5 && BMI <= 24.9 ) {
        return "Normal range";
    } else if (BMI > 24.9){
        return "Overweight";
    } else if (BMI < 18.5){
        return "Underweight"
    } else {
        throw new Error("Input incorrect")
    }
}

if (require.main === module){
    console.log(calculateBmi(Number(process.argv[2]), Number(process.argv[3])));
}

export default calculateBmi

