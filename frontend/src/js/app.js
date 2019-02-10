import {Http} from "./http.js";

const http = new Http('http://localhost:7777/items'); // объект класса
const ulEl = document.querySelector('#tasks');
let cachedItems = [];

ulEl.addEventListener('click', (evt) => {
    if (evt.target.getAttribute('data-action') === 'remove') {
        // для упрощения -> while
        const id = evt.target.parentElement.getAttribute('data-id');
        http.removeById(id, () => {
            loadData();

        });
    }
});

ulEl.addEventListener('change', (evt) => {
    if (evt.target.getAttribute('data-change') === 'done') {
        // console.log(evt.target.checked);

        const id = Number(evt.target.parentElement.parentElement.getAttribute('data-id'));
        const item = cachedItems.find((value) => {
            return value.id === id;
        });
        item.done = evt.target.checked;
        http.save(item, () => {
            loadData();
        });

    }
});
loadData();

function loadData() { // перерисовка всего
    http.getAll((items) => {
        cachedItems = items;
        ulEl.innerHTML = '';
        items.forEach((item) => {
            const liEl = document.createElement('li');
            liEl.setAttribute('data-id', item.id); // добавление атрибута в li элемент data-id='item.id'
            liEl.innerHTML = `
                <label><input data-change="done" type="checkbox">${item.name}</label>
                <button data-action="remove">Remove</button>
            `;
            const checkboxEl = liEl.querySelector('[data-change=done]');
            checkboxEl.checked = item.done;
            ulEl.appendChild(liEl);
        })
    });
}