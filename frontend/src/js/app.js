import {Http} from "./http.js";


const http = new Http('http://localhost:7777/items'); // объект класса
const ulEl = document.querySelector('#tasks');
const postButtonEl = document.querySelector('#post');
const textEl = document.querySelector('#test');
let cachedItems = [];

ulEl.addEventListener('click', async (evt) => {
    if (evt.target.getAttribute('data-action') === 'remove') {
        // для упрощения -> while
        const id = evt.target.parentElement.getAttribute('data-id');
        await http.removeById(id);
        await loadData();
    }
});
let nextId = 1;

postButtonEl.addEventListener('click', async (evt) => {
    const response = await http.getAll(); // getAll -> получает Promise
    const data = await response.json(); // получает Promise
    cachedItems = data;
    const task = {
        id: 1,
        name: 'text',
        done: false
    };
    await http.add(task);
    await loadData();
    console.log(task);
});

ulEl.addEventListener('change', async (evt) => {
    if (evt.target.getAttribute('data-change') === 'done') {
        // console.log(evt.target.checked);

        const id = Number(evt.target.parentElement.parentElement.getAttribute('data-id'));
        const item = cachedItems.find((value) => {
            return value.id === id;
        });
        item.done = evt.target.checked;
        await http.save(item);
        await loadData();

    }
});
loadData();

async function loadData() { // перерисовка всего
    try {
        const response = await http.getAll(); // getAll -> получает Promise
        const data = await response.json(); // получает Promise
        cachedItems = data;


        ulEl.innerHTML = '';

        cachedItems.forEach((item) => {
            const liEl = document.createElement('li');
            liEl.setAttribute('data-id', item.id); // добавление атрибута в li элемент data-id='item.id'
            liEl.innerHTML = `
                    <label><input data-change="done" type="checkbox">${item.name}</label>
                    <button data-action="remove">Remove</button>
                `;
            const checkboxEl = liEl.querySelector('[data-change=done]');
            checkboxEl.checked = item.done;
            ulEl.appendChild(liEl);
        });
        console.log(cachedItems);
    } catch (e) {
        console.log(e);
    }

}
