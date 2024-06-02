"use strict";
// https://restcountries.com/#endpoints-currency

// API KEY:b373a9c11a3542a45f331425

import { countryCurrencyArray } from "./data.js";

// SELECT ELEMENTS
const countryCodes = document.querySelectorAll(".country__code");
const countryInputs = document.querySelectorAll(".country__input");

/* const fetchCountries = async function () {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    const countries = data.map((country) => ({
      countryName: country.name.common,
      currency: country.currencies,
    }));
    console.log(countries);
    console.log(data[1]);
  } catch (error) {
    console.error(`Error fetching data of countries: ${error} `);
  }
}; 

fetchCountries();*/

let targetCurrency = {};
let otherCurrency = {};

const fetchData = async function (targetCountryId) {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/b373a9c11a3542a45f331425/latest/${targetCountryId}`
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
const displayCurrencyCode = function () {
  countryCodes.forEach((countryCode) => {
    const countryName = countryCode
      .closest(".country")
      .querySelector(".country__name").textContent;

    const matchedData = countryCurrencyArray.find(
      (countryData) => countryData.country === countryName
    );

    if (matchedData) {
      countryCode.textContent = matchedData.currencyCode;
    }
  });
};

const displayCurrencyRate = async function (e) {
  try {
    const targetCountryName = e.target.id;
    const targetCountry = countryCurrencyArray.find((countryData) => {
      return countryData.country === targetCountryName;
    });

    targetCurrency = {
      country: targetCountry.country,
      currencyCode: targetCountry.currencyCode,
    };

    // Find other countries
    const otherCountries = Array.from(countryInputs)
      .filter((input) => input !== targetCountryName)
      .map((input) => input.id);

    const otherCountriesId = getOthersId(otherCountries);

    otherCurrency = Object.assign(
      {},
      { country: otherCountries, currencyCode: otherCountriesId }
    );

    // Fetch target currency data
    const targetRate = await fetchData(targetCountry.currencyCode);

    otherCurrency.conversionRate = otherCurrency.currencyCode.map(
      (currency) => targetRate[currency]
    );

    displayOtherInput(otherCurrency, e);

    // Find others currency
  } catch (error) {
    console.error(error);
  }
};

const getOthersId = function (otherCountries) {
  const otherCountriesId = otherCountries.map(
    (otherCountry) =>
      countryCurrencyArray.find((item) => item.country === otherCountry)
        .currencyCode
  );
  return otherCountriesId;
};

const displayOtherInput = function (otherCurrency, e) {
  const targetValue = e.target.value;
  console.log(targetValue);
  countryInputs.forEach((countryInput) => {
    const currencyIndex = otherCurrency.country.indexOf(countryInput.id);
    if (currencyIndex !== -1) {
      countryInput.value = Math.round(
        targetValue * otherCurrency.conversionRate[currencyIndex]
      );
      countryInput.style.color = "#ffffff";
    }
  });
};

// *************Event Handler******************
document.addEventListener("DOMContentLoaded", function () {
  displayCurrencyCode();
});

countryInputs.forEach((countryInput) => {
  countryInput.addEventListener("input", function (e) {
    e.preventDefault();
    displayCurrencyRate(e);
  });
});
