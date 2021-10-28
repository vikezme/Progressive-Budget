let db;
let offlineBudget;

const request = indexedDB.open('BudgetDB', offlineBudget || 21);

request.onupgradeneeded = function (event) {
  console.log('Upgrade needed in IndexDB');

  db = event.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('BudgetStore', { autoIncrement: true });
  }
};

function checkDatabase() {
    console.log('Checking offline db');

    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    const getAll = store.getAll();

    getAll.onsuccess = function () {

        if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((res) => {
            if (res.length !== 0) {
              transaction = db.transaction(['BudgetStore'], 'readwrite');

              const currentStore = transaction.objectStore('BudgetStore');

              currentStore.clear();
              console.log('Store now empty: checkDatabase has run');
            }
          });
      }
    };
  }

  request.onsuccess = function (event) {
    console.log('success');
    db = event.target.result;

    if (navigator.onLine) {
      console.log('Back online');
      checkDatabase();
    }
  };


 const saveRecord = (record) => {
    console.log('Save record invoked');
    const transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    store.add(record);
  };


window.addEventListener('online', checkDatabase);
