const BASE_URL = "https://open.er-api.com/v6/latest/";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".swap");

// Populate dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

// Swap button
swapIcon.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
});

// Fetch exchange rate
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let amt = document.querySelector(".amount input");
  let amtValue = amt.value;

  if (amtValue === "" || amtValue < 1) {
    amtValue = 1;
    amt.value = "1";
  }

  try {
    const response = await fetch(`${BASE_URL}${fromCurr.value}`);
    const data = await response.json();

    if (data.result === "success") {
      let rate = data.rates[toCurr.value];
      let finalAmt = (amtValue * rate).toFixed(2);
      msg.innerText = `${amtValue} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
    } else {
      msg.innerText = "⚠️ Failed to fetch rates. Try again later.";
    }
  } catch (err) {
    msg.innerText = "⚠️ Network Error!";
  }
});
