const createAutoComplete=({root,renderOption,onOptionSelect,inputValue,fetchData})=>{

root.innerHTML = `
<label><b> Search for a Movie</b></label>
<input class="input"/>
<div class="dropdown">
<div class="dropdown-menu">
<div class="dropdown-content result"></div>
</div>
</div>`;

const input = root.querySelector("input");
const dropdown = root.querySelector(".dropdown");
const resultWrapper = root.querySelector(".result");

const onInput = async (event) => {
  const items = await fetchData(event.target.value);
  if (!items.length) {
    dropdown.classList.remove("is-active");
    return;
  }
  resultWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  
  for (let item of items) {
    const option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.innerHTML =renderOption(item)
    option.addEventListener("click", (event) => {
      input.value = inputValue(item);
      dropdown.classList.remove("is-active");
      onOptionSelect(item);
    });
    resultWrapper.appendChild(option);
  }
}
input.addEventListener("input", debounce(onInput));
document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};