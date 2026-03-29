async function trace(url, redirectArr = []) {
    const OPTIONS = { method: 'HEAD', redirect: 'manual' };
    const response = await fetch(url, OPTIONS);

    const [newURL] = __addTrace(response, redirectArr);

    if (newURL && response.status >= 300 && response.status < 400)
        return await trace(newURL, redirectArr);

    return redirectArr;
};

function __addTrace(res, arr = []) {
    let nextLocation = res.headers.get('location');

    if (nextLocation && !nextLocation.startsWith('http'))
        nextLocation = new URL(nextLocation, res.url).href;

    const traceObj = {
        from: res.url,
        status: res.status,
        to: nextLocation,
    }

    arr.push(traceObj)
    return [nextLocation, arr];
};

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
        tr3.textContent = `${element.from}`;

        tr.append(tr1, tr2, tr3);
        tbody.appendChild(tr);
    });

    thead.append(td1, td2, td3);
    table.append(thead, tbody);

    return table;
};

export { trace, drawTable };