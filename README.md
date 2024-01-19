# Getting Started to Run App
Explore website: [![Website Preview](https://img.shields.io/badge/Preview-website-blue)](https://invoice-generator-nu.vercel.app/)

### Installation
To install dependencies:

1. Run `npm i` in the Project directory (For frontend dependency)
2. Navigate to `/backend` and run `npm i` (For backend dependency)
3. Do not forget to replace your email configuration with mine
4. Also replace proxy URL and API endpoint URL point to backend server to get data

# Frontend & Backend Packages

1. **Frontend**: React with Webpack (Live on [Vercel](https://invoice-generator-nu.vercel.app/))
2. **Backend**: Express (Live on [Render](https://invoice-generator-t3sr.onrender.com/))

# Running the App

To start the app:

1. Start the backend server with `node server`
2. For the frontend, run `npm run dev` in the Project directory

# Page URLs

1. Main URL (`/`) for creating an invoice
2. Preview invoice:
   - `/invoice`
   - `/invoice/:invoice_number`
3. 404 page

# Project Description

The app is an invoice generator tool allowing users to create, view, and send invoices via email. Upon invoice creation, the form data is stored as a JSON file on the backend, later on we can connect with Database to store data. The "Invoice Number" field only accepts numbers, which become part of the file name. To view a specific invoice, access `/invoice/:invoice_number` with your invoice number.

In the view invoice page, users can download the invoice and send it via email to the recipient.

# Important Links

Preview example invoices:

1. [Normal (Un-paid) Invoice](http://localhost:3000/invoice/7530)
2. [Invoice with Near Due Date (3 days check)](http://localhost:3000/invoice/00175)
3. [Invoice with Passed Due Date](http://localhost:3000/invoice/562)
4. [Invoice with No Due Date](http://localhost:3000/invoice/758)
5. [Invoice with Fully Paid Status](http://localhost:3000/invoice/485)

# Reference Links

1. [Dribbble](https://dribbble.com/) - Designs
2. [Send Email - Brevo SMTP](https://www.brevo.com/)

# Contributing
Feel free to contribute to the development of this project. Fork the repository, make your changes, and submit a pull request.
If you find this project helpful, consider giving credit to the original author [![GitHub stars](https://img.shields.io/github/stars/vishwakarmanikhil/Invoice-Generator.svg?style=social)](https://github.com/vishwakarmanikhil/Invoice-Generator) and star the project on GitHub. Your support is highly appreciated!

# Acknowledgments
Special thanks to the React community, [Vercel](https://vercel.com/), [Render](https://render.com/) and other open-source contributors for their invaluable tools and resources.
