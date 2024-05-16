# Capital-Commander

[Visit the project here!](https://main--capitalcommander.netlify.app)

- Note: Loading data from the server may take some time.

## MERN Stack Project

- **Frontend:** TypeScript, React
- **Backend:** TypeScript, Node.js (Express)
- **Database:** MongoDB (Mongoose)

## Description

### Features:

- **Expense Tracking:** Replaces my old Excel sheets with this expense tracking system. It offers the flexibility to change base (default) currency (CZK, EUR, USD) according to real-time currency conversion rates from [CurrencyBeacon](https://currencybeacon.com/).
<p align="center">
  <img src="https://raw.githubusercontent.com/Andrij-Kolomijec/Capital-Commander/main/client/src/assets/previews/preview-expenses.png" alt="Preview Expenses Screenshot"/>
</p>

- **Stock Fundamental Data:** Explore fundamental data on various stocks in the "Investing" section.
<p align="center">
  <img src="https://raw.githubusercontent.com/Andrij-Kolomijec/Capital-Commander/main/client/src/assets/previews/preview-financials.gif" alt="Preview Investing Gif"/>
</p>

- **Account Management:** Allows to change password or delete account.
<p align="center">
  <img src="https://raw.githubusercontent.com/Andrij-Kolomijec/Capital-Commander/main/client/src/assets/previews/preview-settings.png" alt="Preview Settings Screenshot"/>
</p>

### Key Technologies:

- **React Router:** Manage app routing with React Router, ensuring protected routes with loaders.
- **Tanstack Query:** Efficiently load and submit data with Tanstack Query, offering seamless data caching and state management.
- **Puppeteer:** Scrapes data from [Gurufocus](https://www.gurufocus.com/) and [Macrotrends](https://www.macrotrends.net/) websites in compliance with terms and conditions and robots.txt files, facilitating dynamic content updates.
- **Authentication:** Utilizes JSON Web Tokens for authentication, with token management and expiration dates stored in local storage. Additional security provided by the bcrypt package.
- **Framer Motion:** Enhances user experience with smooth animations powered by Framer Motion library.

### Future Improvements:

- **Scraping Optimization:** Explore options to overcome limitations in scraping data, such as exploring alternative data sources or subscription services or optimizing scraping algorithms.
- **Additional Features:** Enhance the investing tab with additional functionalities related to ETFs and options. Expand the range of customizations available to users through the settings tab.
