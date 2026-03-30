const $input = document.getElementById('form__input');
const $button = document.getElementById('form__button');
const $table = document.getElementById('results-container');

$button.addEventListener('click', async (event) => {
    event.preventDefault();

    const WORKER_URL = 'https://rastreador-redirecciones.jaldekoa.workers.dev/';
    const url = $input.value;
    $button.disabled = true;

    try {
        const response = await fetch(`${WORKER_URL}?url=${encodeURIComponent(url)}`);
        const redirectArr = await response.json();

        const resTable = drawTable(redirectArr);
        $table.replaceChildren(resTable);
    } catch (err) {
        console.error("Error en el rastreo:", err);
    } finally {
        $button.disabled = false;
    }
});

function drawTable(redirectArr) {
    const table = document.createElement('table');

    const thead = document.createElement('thead');

    // Table header
    const td1 = document.createElement('td');
    td1.textContent = 'Nº';
    const td2 = document.createElement('td');
    td2.textContent = 'Código';
    const td3 = document.createElement('td');
    td3.textContent = 'Dirección';

    // Table body
    const tbody = document.createElement('tbody');

    // Body rows
    redirectArr.forEach((element, idx) => {
        const tr = document.createElement('tr');

        if (element.status >= 200 && element.status < 300) tr.classList.add('status-ok');
        if (element.status >= 300 && element.status < 400) tr.classList.add('status-redirect');
        if (element.status >= 400 && element.status < 500) tr.classList.add('status-bad-request');
        if (element.status >= 500 && element.status < 600) tr.classList.add('status-server-error');

        const tr1 = document.createElement('td');
        tr1.textContent = `${idx}`;
        const tr2 = document.createElement('td');
        tr2.textContent = `${element.status}`;
        const tr3 = document.createElement('td');
        const a = document.createElement('a');
        a.setAttribute('href', `${element.from}`);
        a.setAttribute('target', '_blank');
        a.textContent = `${element.from}`;
        tr3.appendChild(a);

        tr.append(tr1, tr2, tr3);
        tbody.appendChild(tr);
    });

    thead.append(td1, td2, td3);
    table.append(thead, tbody);

    return table;
};