import React, { useCallback, useEffect, useState } from "react";
import "./RewardsCalculator.css";
import { PointsCalculate } from "./PointsCalculate";

const RewardsCalculator = () => {
  const [transactions, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrans = async () => {
      try {
        const response = await fetch("/transaction.json");
        if (!response.ok) {
          throw new Error("Failed to load data");
        }
        const data = await response.json();
        setTransaction(data);
        // console.log("Data===", data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrans();
  }, []);

  const calculateRewards = useCallback(() => {
    const rewards = {};
    transactions.forEach(({ customerId, transactionAmount, date }) => {
      const transactionDate = new Date(date);
      //   console.log("date===", transactionDate);
      //   const month = transactionDate.getMonth() + 1;
      const monthName = transactionDate.toLocaleString("default", {
        month: "long",
      });
      const points = PointsCalculate(transactionAmount);

      if (!rewards[customerId]) {
        rewards[customerId] = {
          transactions: [],
          monthlyPoints: {},
          totalPoints: 0,
        };
      }

      //store the 3 months transaction details
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      if (transactionDate >= threeMonthsAgo) {
        rewards[customerId].transactions.push({
          date: transactionDate,
          transactionAmount,
          points,
          monthName,
        });
      }
      //Calculate Monthly Points
      if (!rewards[customerId].monthlyPoints[monthName]) {
        rewards[customerId].monthlyPoints[monthName] = 0;
      }

      rewards[customerId].monthlyPoints[monthName] += points;
      rewards[customerId].totalPoints += points;
    });
    return rewards;
  }, [transactions]);

  if (loading) return <div>Loading....</div>;
  if (error) return <div>{error}</div>;

  const rewards = calculateRewards();
  return (
    <div className="rewards-container">
      <h1>Customer Rewards List</h1>
      <div className="rewards-list">
        {Object?.entries(rewards).map(
          ([customerId, { monthlyPoints, totalPoints }]) => (
            <div key={customerId} className="customer-rewards card">
              <h3>Customer : {customerId}</h3>
              <div className="rewards-sec">
                <p className="total-points">Total Rewards Points</p>
                <p className="highlight-gold">{totalPoints}</p>
              </div>
              <div className="monthly-summary">
                <h4>Monthly Points:</h4>
                {Object?.keys(monthlyPoints).map((monthName) => (
                  <p key={monthName}>
                    {monthName} : {monthlyPoints[monthName]} Points
                  </p>
                ))}
              </div>
              <div className="transaction-list">
                <h4>Transactions (Last 3 Months) :</h4>
                {transactions.map((transaction, index) => (
                  <div key={index} className="transaction-item">
                    <p>
                      {" "}
                      ${transaction.transactionAmount.toFixed(2)} -{" "}
                      <span>
                        {" "}
                        {new Date(transaction.date).toLocaleDateString(
                          "default",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RewardsCalculator;
