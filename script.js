import { trace, drawTable } from './main.js'

const $input = document.getElementById('form__input');
const $button = document.getElementById('form__button');
const $table = document.getElementById('results-container');

$button.addEventListener('click', async (event) => {
    event.preventDefault();

    const url = $input.value;
    const redirectArr = await trace(url);
    const resTable = drawTable(redirectArr);

    $table.replaceChildren(resTable);
});