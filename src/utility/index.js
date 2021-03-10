export function setTitle(title) {
  document.title = title + ' | Q-ROBOT'
}

export function setDescription(description) {
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', description)
}

export function shortenText(text, length, tail = '...') {
  text = '' + text
  return text.substr(0, length) + tail
}

export function roundNumber(number, count = 0) {
  return Math.floor(number * Math.pow(10, count)) / Math.pow(10, count)
}

export function vtextToText(text) {
  try {
    return text
      .replace(/\{([^|}]+)\|([^|{]+)\}/g, '$1')
      .replace(/\{([^|}]+)\}/g, '$1')
      .replace(/\^/g, '')
  } catch (e) {
    console.warn(`[vtextToText]cannot revise: "${text}"`, e)
    return false
  }
}

export function textToSsml(text) {
  let ssml = String(text)
  try {
    ssml = ssml
      .replace(/[</>]/g, ' ')
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('')
      .replace(
        /\{([^|}]+)\|([^|{]+)\}/g,
        `<phoneme alphabet="x-amazon-pron-kana" ph="$2">$1</phoneme>`
      )
      .replace(/\{([^|}]+)\}/g, '')
      // .replace(/。/g, '<break time="0.2s"></break>')
      .replace(/、/g, '<break time="0.2s"></break>')
      .replace(/\^/g, '<break time="0.1s"></break>')
    ssml = `<speak>${ssml}</speak>`
    return ssml
  } catch (e) {
    console.warn(`[textToSsml]cannot revise`, text, e)
    return false
  }
}

export async function sleep(msec) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec)
  })
}
