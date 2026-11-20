// Netlify serverless function: proxies text-to-speech requests to
// Azure AI Speech, so the Azure key never reaches the browser.
// (ElevenLabs voices are called straight from the browser instead —
// this function is only used for the Azure-voice pills.)
//
// Configure in Netlify: Site configuration -> Environment variables
//   AZURE_SPEECH_KEY     (from your Azure Speech resource)
//   AZURE_SPEECH_REGION  (e.g. "eastus" — whatever region you created it in)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const { text, voice } = payload;
  if (!text || !voice) {
    return { statusCode: 400, body: 'Missing "text" or "voice"' };
  }
  if (text.length > 4000) {
    return { statusCode: 400, body: 'Text chunk too long' };
  }

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    return { statusCode: 500, body: 'AZURE_SPEECH_KEY or AZURE_SPEECH_REGION is not set on this Netlify site yet.' };
  }

  try {
    // Step 1: exchange the subscription key for a short-lived token.
    const tokenRes = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Length': '0' }
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return { statusCode: tokenRes.status, body: `Azure token error: ${t}` };
    }
    const token = await tokenRes.text();

    // Step 2: synthesize speech with that token.
    const safeText = String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const ssml = `<speak version='1.0' xml:lang='en-US'><voice name='${voice}'>${safeText}</voice></speak>`;

    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'ListenApp'
      },
      body: ssml
    });
    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: res.status, body: `Azure TTS error: ${errText}` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
      body: buf.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
};
