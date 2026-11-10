# SpendWise — Interactive Budget Dashboard

SpendWise is a responsive personal budgeting application built with **HTML, CSS, and vanilla JavaScript**. It helps users set a monthly spending limit, record expenses, review transactions, and understand where their money goes.

## Features

- Set and update a monthly budget in Kenyan shillings (KES).
- Add expenses with a name, amount, category, and date.
- View monthly spending, remaining budget, and transaction count.
- Receive budget feedback when spending is low, approaching the limit, or over budget.
- View a category-by-category spending breakdown.
- Filter transactions to show this month or all recorded expenses.
- Delete an expense.
- Save expenses and budget in browser `localStorage`.
- Responsive layout for desktop, tablet, and mobile screens.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, dashboard cards, forms, and transaction table |
| `style.css` | Responsive layout, colors, cards, forms, and transaction styling |
| `script.js` | Expense data, calculations, conditions, loops, DOM updates, and events |

## Improvements made this week

The SpendWise dashboard has been upgraded from a static page into an interactive budgeting application. Users can add and delete multiple expense records, set a monthly budget, filter their transaction history, and see summary figures and category totals update immediately. Budget progress and feedback are recalculated whenever the data changes. The application also remembers data between visits using browser local storage.

## How JavaScript concepts are used

### 1. Decision making with conditionals

The project uses `if`, `else if`, and `else` statements to make decisions. For example, the dashboard checks the total expenses against the monthly budget:

- If no expenses have been recorded, it displays a getting-started message.
- If spending is greater than the budget, it warns that the budget has been exceeded.
- If 70% or more of the budget has been used, it displays a caution message.
- Otherwise, it confirms that spending is within budget.

Conditionals are also used to validate form values, prevent future expense dates, and display an empty-state message when there are no transactions.

### 2. Arrays for multiple records

Expenses are stored in an array named `expenses`. Each item is an object containing an ID, description, amount, category, and date. This makes it possible to add, display, filter, and delete many expenses without creating separate variables for each record.

The array is saved as JSON in `localStorage` and loaded when the application starts.

### 3. Processing data with loops

The application uses `for...of` loops to process expense records. Loops calculate the monthly spending total, group amounts by category, and create a table row for each visible transaction. This means the same code works whether the user has one expense or many.

### 4. DOM manipulation

JavaScript selects dashboard elements with `document.getElementById()` and updates their text and styles. For example, `renderSummary()` updates the budget, total spent, remaining amount, transaction count, and progress bar.

The transaction table and category breakdown are rebuilt dynamically with `document.createElement()`, `textContent`, and `appendChild()`. The app uses text nodes rather than inserting user-provided values as HTML.

### 5. Events and user interactions

Event listeners respond to user actions:

- The expense form's `submit` event validates and adds a new expense.
- The budget form's `submit` event saves a new monthly budget.
- The month filter's `change` event refreshes the transaction list.
- Each delete button's `click` event removes its matching expense.

After data changes, the app saves the data and calls the render functions so the dashboard is updated immediately.

### 6. Connecting the application flow

For example, when a user submits an expense:

1. The form submit event calls `addExpense()`.
2. JavaScript validates the entered values.
3. A new expense object is added to the `expenses` array.
4. The updated array is saved in local storage.
5. The render functions recalculate totals and update the dashboard, category breakdown, and transaction table.
6. The user sees a confirmation message.

## Challenges and solutions

- **Keeping the dashboard in sync:** Updating several areas separately could cause inconsistent totals. The project uses a central `renderApp()` function to refresh the summary, transactions, and category breakdown after changes.
- **Handling saved data safely:** Local storage contains JSON text and may be empty or invalid. The loading functions use `try...catch` and check the saved values before using them.
- **Validating user input:** Empty names, invalid amounts, and future dates could produce incorrect records. The form checks these values before adding an expense.
- **Displaying user-entered text safely:** Instead of inserting user values with `innerHTML`, the app creates DOM elements and assigns values through `textContent`.

## How to run the project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the **Live Server** extension.
4. Set your monthly budget, then add expenses to test the dashboard.
5. Refresh the page to confirm that your data remains saved.

## Testing checklist

- [ ] Add an expense with valid information.
- [ ] Try submitting an empty or invalid amount.
- [ ] Try entering a future date.
- [ ] Change the monthly budget.
- [ ] Confirm the spending summary and progress bar update.
- [ ] Add enough expenses to reach 70% of the budget and then exceed it.
- [ ] Filter between this month and all time.
- [ ] Delete an expense and confirm totals update.
- [ ] Refresh the browser and confirm data is retained.
- [ ] Test the layout on a narrow/mobile screen.

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Browser localStorage

---

**SpendWise — Make every shilling count.**
