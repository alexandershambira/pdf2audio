// Netlify serverless function: proxies text-to-speech requests to
// ElevenLabs or OpenAI so the API keys never reach the browser.
// Configure the keys in Netlify: Site settings -> Environment variables
//   ELEVENLABS_API_KEY
//   OPENAI_API_KEY

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

  const { provider, text, voiceId, voice } = payload;

  if (!text || !provider) {
    return { statusCode: 400, body: 'Missing "text" or "provider"' };
  }
  if (text.length > 4000) {
    return { statusCode: 400, body: 'Text chunk too long' };
  }

  try {
    if (provider === 'elevenlabs') {
      const key = process.env.ELEVENLABS_API_KEY;
      if (!key) {
        return { statusCode: 500, body: 'ELEVENLABS_API_KEY is not set on this Netlify site yet.' };
      }
      // Default voiceId below is ElevenLabs' premade "Adam" voice.
      // If it ever stops matching, copy the current ID from the
      // ElevenLabs Voice Library and pass it in as voiceId instead.
      const id = voiceId || 'pNInz6obpgDQGcFmaJgB';
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': key,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        return { statusCode: res.status, body: `ElevenLabs error: ${errText}` };
      }
      const buf = Buffer.from(await res.arrayBuffer());
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
        body: buf.toString('base64'),
        isBase64Encoded: true
      };
    }

    if (provider === 'openai') {
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        return { statusCode: 500, body: 'OPENAI_API_KEY is not set on this Netlify site yet.' };
      }
      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: voice || 'onyx',
          input: text
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        return { statusCode: res.status, body: `OpenAI error: ${errText}` };
      }
      const buf = Buffer.from(await res.arrayBuffer());
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
        body: buf.toString('base64'),
        isBase64Encoded: true
      };
    }

    return { statusCode: 400, body: 'Unknown provider: ' + provider };
  } catch (err) {
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
};
