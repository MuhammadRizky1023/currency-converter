const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_code) {
        let selected;
        if (i == 0) {
            selected = currency_code === "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code === "NPR" ? "selected" : "";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML('beforeend', optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Memperbaiki selektor icon
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchange();
});

function loadFlag(element) {
    for (let code in country_code) {
        if (code === element.value) {
            let imageTag = element.parentElement.querySelector("img");
            imageTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
        }
    }
}

getButton.addEventListener('click', e => {
    e.preventDefault();
    getExchange();
});

function getExchange() {
    const amount = document.querySelector('.amount input');
    let amountVal = amount.value;
    if (amountVal === "" || amountVal == 0) {
        amount.value = '1';
        amountVal = 1;
    }
    const api = `https://v6.exchangerate-api.com/v6/a279d630efc90208bdc741fa/latest/${fromCurrency.value}`;
    fetch(api)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            const weakCurrencies = ["IDR", "VND", "LAK", "COP", "IRR", "KRW", "JPY", "LKR", "PKR"];
            
            if (weakCurrencies.includes(toCurrency.value)) {
                totalExchangeRate = parseFloat(totalExchangeRate).toLocaleString('id-ID');
            }
            const exchangeRateText = document.querySelector(".exchange-rate"); // Perbaikan selektor
            exchangeRateText.innerHTML = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        });
}
