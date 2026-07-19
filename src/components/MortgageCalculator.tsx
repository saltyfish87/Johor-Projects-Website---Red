import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, Calendar, Percent, Landmark, HelpCircle } from "lucide-react";

interface MortgageCalculatorProps {
  basePriceMyr: number; // e.g. 1200000
  activeCurrency: string; // "MYR", "SGD", "USD", "CNY"
}

// Exchange rates: 1 unit of foreign currency = X MYR
const rates: Record<string, number> = {
  MYR: 1.0,
  SGD: 3.45,
  USD: 4.65,
  CNY: 0.65
};

export default function MortgageCalculator({ basePriceMyr, activeCurrency }: MortgageCalculatorProps) {
  // Convert MYR price into active currency price
  const convertedPrice = Math.round(basePriceMyr / (rates[activeCurrency] || 1));

  // Input states in the active currency
  const [price, setPrice] = useState(convertedPrice);
  const [downpaymentPercent, setDownpaymentPercent] = useState(10); // in % (e.g. 10%)
  const [interestRate, setInterestRate] = useState(3.8); // in % (e.g. 3.8%)
  const [tenureYears, setTenureYears] = useState(30); // in years (e.g. 30)

  // Sync state if property base price or active currency changes
  useEffect(() => {
    setPrice(Math.round(basePriceMyr / (rates[activeCurrency] || 1)));
  }, [basePriceMyr, activeCurrency]);

  // Derived values
  const downpaymentAmount = Math.round((price * downpaymentPercent) / 100);
  const loanAmount = price - downpaymentAmount;

  // Mortgage Amortization Calculation
  // M = P * (1 - D/100) * [ (r/12) * (1 + r/12)^(12N) ] / [ (1 + r/12)^(12N) - 1 ]
  const calculateMonthlyPayment = () => {
    if (loanAmount <= 0) return 0;
    const r = interestRate / 100; // Annual interest rate as decimal
    const monthlyRate = r / 12;
    const totalPayments = tenureYears * 12;

    if (monthlyRate === 0) {
      return Math.round(loanAmount / totalPayments);
    }

    const num = monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
    const den = Math.pow(1 + monthlyRate, totalPayments) - 1;
    const payment = loanAmount * (num / den);
    return isNaN(payment) || !isFinite(payment) ? 0 : Math.round(payment);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalRepayment = monthlyPayment * tenureYears * 12;
  const totalInterest = totalRepayment - loanAmount;

  // Convert to MYR for compliance cross-reference
  const monthlyPaymentInMyr = Math.round(monthlyPayment * (rates[activeCurrency] || 1));

  const formatCurrency = (val: number, cur: string) => {
    const symbolMap: Record<string, string> = {
      MYR: "RM ",
      SGD: "S$ ",
      USD: "$ ",
      CNY: "¥ "
    };
    return (symbolMap[cur] || "") + val.toLocaleString("en-US");
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 font-sans shadow-sm" id="mortgage-calculator">
      
      {/* Title */}
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg">Financial Affordability Logic</h3>
          <p className="text-xs text-slate-500 font-mono">Amortization & Cross-Border Exchange Calculator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Hand: Controls */}
        <div className="space-y-5">
          
          {/* Property Price Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-slate-400" />
                Property Valuation ({activeCurrency})
              </label>
              <span className="text-xs text-slate-400 font-mono">Base: {formatCurrency(basePriceMyr, "MYR")}</span>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 font-mono text-sm">{activeCurrency}</span>
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="block w-full rounded-lg border-slate-200 pl-14 pr-4 py-2.5 text-sm font-semibold focus:border-blue-500 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Downpayment Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-slate-400" />
                Downpayment Amount
              </label>
              <span className="text-sm font-semibold text-slate-800">{downpaymentPercent}% ({formatCurrency(downpaymentAmount, activeCurrency)})</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              step="1"
              value={downpaymentPercent}
              onChange={(e) => setDownpaymentPercent(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>Min (5%)</span>
              <span>Typical (10%)</span>
              <span>Max (90%)</span>
            </div>
          </div>

          {/* Interest Rate Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-slate-400" />
                Annual Interest Rate
              </label>
              <span className="text-sm font-semibold text-slate-800">{interestRate}%</span>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="15"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="block w-full rounded-lg border-slate-200 px-3 py-2.5 text-sm font-semibold focus:border-blue-500 focus:ring-blue-500 bg-white"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-slate-400 text-sm">%</span>
              </div>
            </div>
          </div>

          {/* Loan Tenure Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                Loan Tenure (Years)
              </label>
              <span className="text-sm font-semibold text-slate-800">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>5 Years</span>
              <span>30 Years</span>
              <span>35 Years</span>
            </div>
          </div>

        </div>

        {/* Right Hand: Visual Output Block */}
        <div className="flex flex-col justify-between bg-white rounded-xl p-6 border border-slate-100 shadow-inner">
          <div className="space-y-6">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-widest block">Standard Amortization Yield</span>
            
            {/* Main Result */}
            <div>
              <p className="text-sm text-slate-500 font-medium">Estimated Monthly Installment</p>
              <h4 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                {formatCurrency(monthlyPayment, activeCurrency)}
                <span className="text-xs text-slate-400 font-normal block mt-1.5 font-mono">
                  Equivalent to approx. {formatCurrency(monthlyPaymentInMyr, "MYR")} / month
                </span>
              </h4>
            </div>

            {/* Sub details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Total Loan Principal</span>
                <span className="font-semibold text-slate-800 font-mono mt-0.5 block">{formatCurrency(loanAmount, activeCurrency)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Interest Repayment</span>
                <span className="font-semibold text-slate-800 font-mono mt-0.5 block">{formatCurrency(totalInterest, activeCurrency)}</span>
              </div>
            </div>
          </div>

          {/* Currency cross-reference indicator */}
          <div className="mt-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-blue-800 leading-relaxed">
            <strong>Cross-Border Investment Info</strong>: Local banks offer financing up to 85% for Singapore citizens and foreign buyers under standard expatriate lending terms (subject to minimum RM 1M threshold and state levy approval).
          </div>
        </div>

      </div>
    </div>
  );
}
