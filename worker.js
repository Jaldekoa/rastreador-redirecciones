export default {
    async fetch(request) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        };

        const { searchParams } = new URL(request.url);
        const targetUrl = searchParams.get('url');

        if (!targetUrl) {
            return new Response(JSON.stringify({ error: "Falta la URL" }), {
                status: 400,
                headers: corsHeaders
            });
        };

        try {
            const redirectArr = await trace(targetUrl);
            return new Response(JSON.stringify(redirectArr), { headers: corsHeaders });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: corsHeaders
            });
        };
    }
};

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