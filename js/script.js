"use strict";
// https://www.exchangerate-api.com/

// Variables
let countries = {};
let matchedData = [];

// SELECT ELEMENTS
const countryAll = document.querySelectorAll(".country");
const container = document.querySelector(".container");

const btn = document.querySelector(".btn");

const options = document.querySelector(".options");
const optionItems = document.querySelectorAll(".options__item");

// Fetching countries data

const fetchCountries = async function () {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    countries = data.map((country) => ({
      countryName: country.name.common,
      currency: country.currencies,
      flag: country.flags,
    }));

    matchingData();
    displayCountriesFlags();
    displayCurrencyCode();
    setElAttribute();
  } catch (error) {
    console.error(`Error fetching data of countries: ${error} `);
  }
};

// Fetching currency rate data
const fetchData = async function (country) {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/b373a9c11a3542a45f331425/latest/${country}`
    );
    const data = await res.json();
    // console.log(data);
    const conversionRate = data.conversion_rates;
    return conversionRate;
  } catch (error) {
    console.error(error);
  }
};

// *************Functions******************

// Countries Related Functions

const matchingData = function () {
  const countryNames = document.querySelectorAll(".country__name");

  for (const entry of Object.entries(countries)) {
    countryNames.forEach((country, index) => {
      if (country.innerHTML === entry[1].countryName) {
        matchedData[index] = entry[1];
      }
    });
  }
};

const displayCountriesFlags = function () {
  const countryFlags = document.querySelectorAll(".country__flag");

  countryFlags.forEach((flag, index) => {
    flag.innerHTML = `<img src="${matchedData[index].flag.svg}" alt="${matchedData[index].flag.alt} flag">`;
  });
};

const displaySideBar = function () {
  const visibility = options.getAttribute("data-visible");
  if (visibility === "false") {
    options.setAttribute("data-visible", "true");
  } else if (visibility === "true") {
    options.setAttribute("data-visible", "false");
  }
};

const displayCurrencyCode = function () {
  const countryCodes = document.querySelectorAll(".country__code");
  const matchCurrency = [];
  matchedData.forEach((data, index) => {
    matchCurrency[index] = Object.keys(data.currency);
  });
  countryCodes.forEach((countryCode, index) => {
    countryCode.textContent = matchCurrency[index];
  });
};

const getInputs = async function (e) {
  try {
    const countryInputs = document.querySelectorAll(".country__input");

    const targetCurrency = e.target.getAttribute("data-currency");
    // console.log(e.target);

    const targetValue = e.target.value;
    const fetchTargetData = await fetchData(targetCurrency);
    // console.log(fetchTargetData);

    countryInputs.forEach((input) => {
      if (input.getAttribute("data-currency") !== targetCurrency) {
        const dataCurrency = input.getAttribute("data-currency");
        const conversionRate = fetchTargetData[dataCurrency];

        input.value = (targetValue * conversionRate).toFixed(2);
      }

      if (targetValue === "") {
        input.value = "";
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const setElAttribute = function () {
  const countryInputs = document.querySelectorAll(".country__input");

  countryInputs.forEach((country, index) => {
    if (matchedData[index].countryName === country.id) {
      const currencyKeys = Object.keys(matchedData[index].currency);
      country.setAttribute("data-currency", currencyKeys);
    } else {
      console.error(`No matched data found for index ${index}`);
    }
  });
};

const addNewCurrency = function (e) {
  const target = e.target.innerHTML;
  const targetItem = e.target;

  const html = `
                   <div class="country">
          <div class="country__info">
            <div class="country__flag"></div>
            <div class="country__name">${target}</div>
          </div>
          <div class="country__currency">
            <input
              type="text"
              class="country__input"
              id="${target}"
              inputmode="numeric"
            />
            <p class="country__code"></p>
            <ion-icon class="country__icon" name="trash-outline"></ion-icon>
          </div>
        </div>
  `;
  // Add new currency into currency board
  container.insertAdjacentHTML("beforeend", html);

  console.log(matchedData);
  matchingData();
  displayCountriesFlags();
  displayCurrencyCode();
  displaySideBar();
  removeNewCurrency(targetItem);
  setElAttribute();
  bindEventListeners();
};

const removeNewCurrency = function (targetItem) {
  targetItem.remove();
};

const deleteCurrency = function (e) {
  e.target.closest(".country").remove();
  console.log(e.target.closest(".country"));
  bindEventListeners();
};

// *************Event Handler******************

document.addEventListener("DOMContentLoaded", function () {
  fetchCountries();
  bindEventListeners();
});

const bindEventListeners = function () {
  const countryInputs = document.querySelectorAll(".country__input");
  const countryIcons = document.querySelectorAll(".country__icon");

  countryInputs.forEach((countryInput) => {
    countryInput.addEventListener("input", function (e) {
      e.preventDefault();
      getInputs(e);
    });
  });

  countryIcons.forEach((icon) =>
    icon.addEventListener("click", function (e) {
      deleteCurrency(e);
    })
  );
};

btn.addEventListener("click", function () {
  displaySideBar();
});

optionItems.forEach((optionItem) =>
  optionItem.addEventListener("click", function (e) {
    addNewCurrency(e);
  })
);
