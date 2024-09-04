import { useEffect, useState } from "react";

export const CurrencySwapForm = () => {
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [exchangeRates, setExchangeRates] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        const data = await response.json();
        setExchangeRates(data);
      } catch (error) {
        setError(`${error} "Please try again later."`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      setError("");
    }
  }, [fromCurrency, toCurrency, amount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!fromCurrency || !toCurrency || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const fromRate = exchangeRates.find(
      (rate) => rate.currency === fromCurrency
    );
    const toRate = exchangeRates.find((rate) => rate.currency === toCurrency);

    if (fromRate && toRate) {
      const exchangedAmount = (amount * fromRate.price) / toRate.price;
      alert(`You will receive ${exchangedAmount.toFixed(2)} ${toCurrency}`);

      setFromCurrency("");
      setToCurrency("");
      setAmount("");
    } else {
      alert("Please select valid currencies.");
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="titleForm">Currency Swap</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="formBox">
            <label htmlFor="fromCurrency" className="label">From:</label>
            <select className="select"
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {exchangeRates.map((rate) => (
                <option key={rate.currency} value={rate.currency}>
                  {rate.currency}
                </option>
              ))}
            </select>
          </div>

          <div className="formBox">
            <label htmlFor="toCurrency" className="label">To:</label>
            <select className="select"
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {exchangeRates.map((rate) => (
                <option key={rate.currency} value={rate.currency}>
                  {rate.currency}
                </option>
              ))}
            </select>
          </div>

          <div className="formBox">
            <label htmlFor="amount" className="label">Amount:</label>
            <input className="input"
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}
          
          <div className="buttons">
            <button type="button" onClick={handleSwap}>
              Reverse
            </button>
            <button type="submit">
              Swap
            </button>
          </div>
        </>
      )}
    </form>
  );
};
