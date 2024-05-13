export const fundamentalParametersExplanation: Record<string, string> = {
  Company: "The name of the company.",
  Symbol: "Ticker symbol which refers to the company on stock exchanges.",
  Sector: "The sector to which the company belongs.",
  Industry: "The specific industry in which the company operates.",
  Country: "The country where the company is headquartered.",
  "IPO year":
    "The year in which the company went public with its initial public offering (IPO).",
  "Market capitalization":
    "The total market value of a company's outstanding shares, calculated by multiplying the current stock price by the total number of outstanding shares.",
  "Stock price":
    "The current price of a single share of the company's stock in the stock market.",
  "PE Ratio (10y Median)":
    "The median Price-to-Earnings (P/E) ratio over the past 10 years, providing an average valuation of the company's stock relative to its earnings over this period.",
  "ROE (10y Median)":
    "The median Return on Equity (ROE) over the past 10 years, showing the average profitability of the company by indicating how much profit it generates with shareholders' equity.",
  "Total Stockholders Equity":
    "The total value of shareholders' equity, representing the difference between a company's total assets and total liabilities.",
  "Shares Outstanding (Diluted Average)":
    "The total number of shares of a company's stock outstanding, accounting for dilution from potential conversion of securities.",
  "PE Ratio":
    "The Price-to-Earnings (P/E) ratio, comparing the current stock price to the company's earnings per share (EPS) to evaluate the market's valuation of the company's stock relative to its earnings.",
  "Shiller PE Ratio":
    "The cyclically-adjusted Price-to-Earnings (CAPE) ratio, which accounts for inflation-adjusted earnings over a 10-year period to assess the market's valuation of the company's stock.",
  "Altman Z-Score":
    "A financial metric that measures the likelihood of a company's bankruptcy within the next two years, based on various financial ratios.",
  "Piotroski F-Score":
    "A score ranging from 0 to 9 that assesses a company's financial strength based on nine criteria, helping investors identify companies with improving financial health.",
  "Beneish M-Score":
    "A model used to detect earnings manipulation by assessing the likelihood that a company's financial statements have been manipulated.",
  "PEG Ratio":
    "The Price/Earnings to Growth (PEG) ratio, which adjusts the P/E ratio for the company's earnings growth rate to provide a more comprehensive valuation metric.",
  "Price-to-Free-Cash-Flow":
    "The ratio of the company's stock price to its free cash flow per share, indicating the market's valuation of the company's ability to generate cash.",
  "PS Ratio":
    "The Price-to-Sales (P/S) ratio, comparing the company's market capitalization to its revenue, providing insight into the company's valuation relative to its sales.",
  "Price-to-Tangible-Book":
    "The ratio of the company's stock price to its tangible book value per share, measuring the market's valuation of the company's tangible assets relative to its stock price.",
  "Dividend Yield %":
    "The dividend yield, calculated as the annual dividend per share divided by the stock price, indicating the percentage return on investment from dividends.",
  "Dividend Payout Ratio":
    "The ratio of the company's dividends per share to its earnings per share, showing the proportion of earnings paid out as dividends.",
  "Shares Buyback Ratio %":
    "The percentage of shares repurchased by the company, reflecting management's decision to return capital to shareholders through share buybacks.",
  "ROE %":
    "The Return on Equity (ROE), calculated as net income divided by shareholders' equity, measuring the company's profitability relative to its shareholders' equity.",
  "Current Ratio":
    "The ratio of the company's current assets to its current liabilities, assessing its short-term liquidity and ability to meet short-term obligations.",
  "Quick Ratio":
    "The ratio of the company's liquid assets to its current liabilities, providing a more conservative measure of its short-term liquidity than the current ratio.",
  "Debt-to-Equity":
    "The ratio of the company's total debt to its shareholders' equity, indicating its leverage and financial risk.",
  "Net Margin %":
    "The net profit margin, calculated as net income divided by revenue, measuring the company's profitability by indicating the percentage of revenue that translates into profit.",
  "EPS without NRI":
    "Earnings per Share (EPS) excluding Non-Recurring Items (NRI), showing the company's earnings per share from continuing operations.",
  "Goodwill / Total Equity":
    "The ratio of the company's goodwill to its total shareholders' equity, assessing the proportion of shareholders' equity represented by goodwill.",
  "ROIC > WACC":
    "A comparison of the company's Return on Invested Capital (ROIC) to its Weighted Average Cost of Capital (WACC), indicating whether the company is generating returns in excess of its cost of capital.",
};

export const fundamentalsColorsExplanation: Record<string, string> = {
  marketCap: "Greater than 500 million USD.",
  lastsale: "Greater than 30 USD.",
  "Altman Z-Score": "Greater than 3.",
  "Beneish M-Score": "Less than -2.22.",
  "Current Ratio":
    "Depends on sector, but ideally should be less than 1, with 2 at most.",
  "Debt-to-Equity":
    "Depends on sector, but ideally should be less than 1, with 2 at most.",
  "Dividend Payout Ratio": "Less than 1.",
  "Dividend Yield %": "Greater than 4% in dividend stocks.",
  "EPS without NRI": "Positive and growing.",
  "Goodwill / Total Equity": "Less than 0.3.",
  "Net Margin %":
    "Compare to sector averages. Ideally between 10 and 20, with 5 to 30 at most.",
  "PE Ratio": "Ideally between 8 and 10, with 15 at most.",
  "PEG Ratio": "Less than 0.8.",
  "PS Ratio": "Compare to sector averages. Ideally below 3.",
  "Piotroski F-Score": "Greater or equal to 5.",
  "Price-to-Free-Cash-Flow": "Ideally less than 10, with 15 at most.",
  "Price-to-Tangible-Book":
    "Depends more on sector, ideally should be less than 1.5.",
  "Quick Ratio": "Greater than 1.",
  "ROE %": "Greater than 15%.",
  "ROIC > WACC": "ROIC should be greater than WACC.",
  "Shares Buyback Ratio %": "Positive when stock is undervalued.",
  "Shiller PE Ratio": "Compare to sector. Ideally under 15, with 20 at most.",
};

export function getTooltipAttributes(content: string) {
  return {
    "data-tooltip-id": "tooltip",
    "data-tooltip-float": true,
    "data-tooltip-content": content,
    "data-tooltip-delay-show": 3000,
    "data-tooltip-delay-hide": 1000,
  };
}
