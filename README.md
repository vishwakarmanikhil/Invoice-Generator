# Getting Started to Run App

### Installation
To install dependencies:

1. Run `npm i` in the Project directory (For frontend dependency)
2. Navigate to `/backend` and run `npm i` (For backend dependency)

# Frontend & Backend Packages

1. **Frontend**: React with Webpack
2. **Backend**: Express

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
