
export const PointsCalculate = (transactionAmount) => {

    let points = 0;
    if(transactionAmount > 100) {
        points += (transactionAmount -100) * 2;   // 2 points for every dollar spent over $100 in each transaction
        transactionAmount = 100;

        // console.log("points===",points)
    }
    if(transactionAmount> 50) {
        points += (transactionAmount-50);
    }
  return Math.floor(points)
}

