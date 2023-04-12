'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ashish Gohil',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-04-08T13:15:33.035Z',
    '2023-04-06T09:48:16.867Z',
    '2023-04-09T06:04:23.907Z',
    '2023-04-03T14:18:46.235Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Payal Barvaliya',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2023-04-08T13:15:33.035Z',
    '2023-04-06T09:48:16.867Z',
    '2023-04-09T06:04:23.907Z',
    '2023-04-03T14:18:46.235Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Riddhi Vaghani',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2023-04-08T13:15:33.035Z',
    '2023-04-06T09:48:16.867Z',
    '2023-04-09T06:04:23.907Z',
    '2023-04-03T14:18:46.235Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'es-ES',
};

const account4 = {
  owner: 'Jinal Trivedi',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2023-04-08T13:15:33.035Z',
    '2023-04-06T09:48:16.867Z',
    '2023-04-09T06:04:23.907Z',
    '2023-04-03T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const timer = document.querySelector('.timer');

let sortState = false; // for sorting feature
let time, timerObj;
const optionsForDate = {
  // timeZone: 'Asia/Kolkata',
  // weekday: 'short',
  year: 'numeric',
  // month: 'short',
  month: '2-digit',
  day: '2-digit',
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const creatDate = function (rowDate, locale) {
  const movDate = new Date(rowDate);
  // console.log(movDate.getTime());
  // console.log(new Date().getTime());
  let timeStamp =
    (new Date().getTime() - movDate.getTime()) / (1000 * 60 * 60 * 24);
  if (timeStamp < 1) {
    return 'Today';
  } else if (timeStamp < 2) {
    return 'yesterday';
  } else if (timeStamp < 7) {
    return `${Math.floor(timeStamp)} Days ago.`;
  }
  return new Intl.DateTimeFormat(locale, optionsForDate).format(movDate);
};

const addMovements = function (acc, sortState) {
  acc.data = acc.movements.map((mov, idx) => {
    return [mov, acc.movementsDates[idx]];
  });
  // console.log(acc.data);
  const mov = sortState
    ? acc.data.slice().sort((a, b) => a[0] - b[0])
    : acc.data;
  containerMovements.innerHTML = '';
  mov.forEach((val, idx) => {
    // console.log(new Date(acc.movementsDates[idx]));
    const movDate = creatDate(val[1], acc.locale);
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${
      val[0] > 0 ? 'deposit' : 'withdrawal'
    }">${idx + 1} ${val[0] > 0 ? 'Deposite' : 'Withdrawal'}</div>
    <div class="movements__date"> ${movDate}</div>
    <div class="movements__value">${new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(val[0])}</div>
  </div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
/////////////////////////////////////////////////

//creating username(initals: ag for (Ashish Gohil))
function createUserName(account) {
  return account.owner
    .toLowerCase()
    .split(' ')
    .map(val => val[0])
    .join('');
}
accounts.forEach(acc => (acc.userName = createUserName(acc)));
// console.log(accounts);

///////////////////////////////////////////////

const calDisplaySumary = function (account) {
  const interestRate = account.interestRate;
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(income)}`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(-out)}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * interestRate * 0.01)
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(interest)}`;
};
// calDisplaySumary(account1);
/////////////////////////////////////////////////

const calLabelBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance)}`;
};
// calLabelBalance(account1);

/////////////////////////////////////////////////
// const account1 = {
//   owner: 'Ashsh Gohil',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };
const logoutTimer = () => {
  if (time === 0) {
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
    clearInterval(timerObj);
  }
  timer.textContent = `${String(Math.floor(time / 60)).padStart(
    2,
    '0'
  )}:${String(time % 60).padStart(2, '0')}`;
  time--;
};
const showAccDetails = function (acc) {
  labelWelcome.textContent = `Welcome, ${acc.owner.split(' ')[0]}`;
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    // month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  addMovements(acc, sortState);
  calLabelBalance(acc);
  calDisplaySumary(acc);
  containerApp.style.opacity = 1;
  time = 300;
  logoutTimer();
  clearInterval(timerObj);
  timerObj = setInterval(logoutTimer, 1000);
};
/////////////////////////////////////////////////

// login functionality
let currAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currAccount = accounts.find(acc => {
    return (
      acc.pin === Number(inputLoginPin.value) &&
      acc.userName === inputLoginUsername.value
    );
  });

  currAccount ? showAccDetails(currAccount) : (containerApp.style.opacity = 0);
  inputLoginPin.blur();
  inputLoginUsername.blur();
  inputLoginPin.value = inputLoginUsername.value = '';
});

/////////////////////////////////////////////////

// transfer functionality
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  if (
    currAccount.userName !== inputTransferTo.value &&
    Number(inputTransferAmount.value) <= currAccount.balance
  ) {
    const transferToAcc = accounts.find(acc => {
      return acc.userName === inputTransferTo.value;
    });
    if (transferToAcc) {
      transferToAcc.movements.push(Number(inputTransferAmount.value));
      currAccount.movements.push(-Number(inputTransferAmount.value));
      currAccount.movementsDates.push(new Date().toISOString());
      transferToAcc.movementsDates.push(new Date().toISOString());
      showAccDetails(currAccount);
    } else {
      //entered account does not exist
      console.log('entered account does not exist');
    }
  } else {
    // handle if not possible to transfer
    console.log('Not possible');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();
});

/////////////////////////////////////////////////
// request loan functionality

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currAccount.movements.some(mov => {
      return mov >= loanAmount * 0.1;
    })
  ) {
    currAccount.movements.push(loanAmount);
    currAccount.movementsDates.push(new Date().toISOString());
    showAccDetails(currAccount);
  } else {
    console.log('Enter correct amount in loan');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

/////////////////////////////////////////////////
// close account functionality
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currAccount.userName &&
    Number(inputClosePin.value) === currAccount.pin
  ) {
    const accIdx = accounts.findIndex(acc => {
      return acc.userName === inputCloseUsername.value;
    });
    // console.log(accIdx);
    accounts.splice(accIdx, 1);
    // console.log(accounts);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  } else {
    console.log('Invalid username or password for closing account');
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  inputCloseUsername.blur();
});

/////////////////////////////////////////////////
// sorting feature
btnSort.addEventListener('click', e => {
  sortState
    ? addMovements(currAccount, false)
    : addMovements(currAccount, true);
  sortState = !sortState;
});

/////////////////////////////////////////////////

////////////////////////
////////////////////////
////////////////////////
// create titleCase of any given string
// const titleCase = function (str) {
//   function firstUpperCase(str) {
//     return str[0].toUpperCase() + str.slice(1);
//   }
//   str = str.toLowerCase();
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   return firstUpperCase(
//     str
//       .split(' ')
//       .map(s => {
//         return exceptions.includes(s) ? s : firstUpperCase(s);
//       })
//       .join(' ')
//   );
// };
// console.log(titleCase('a very niCE paTTern a light up sky'));
// console.log(
//   titleCase(
//     'There is very niCE paTTern as was saying thatt shoULD be nice and SweeT an apple.'
//   )
// );
// const totalDeposit = accounts
//   .flatMap(acc => {
//     acc.movements;
//   })
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(totalDeposit);
