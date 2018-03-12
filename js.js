const mainElement = document.getElementById('main');
const template    = document.getElementById('template').innerHTML;
const probeScript = document.getElementById('probe').innerHTML;
const probeCss    = `
body {
  margin    : 0          !important;
  position  : absolute   !important;
  width     : 100%       !important;
  box-sizing: border-box !important;
}
`;

const parts = [
  {
    type: 'text/html',
    body: document.getElementById('template').innerHTML
  },
  {
    type: 'text/derp',
    body: null
  }
];

mainElement.innerHTML = parts.map(preparePart).join('');
window.addEventListener('message', messageListener, false);

function preparePart ({type, body}) {
  switch (type) {
    case 'text/html':
      const uuid = uuidv4();
      const style = `<style>${probeCss}</style>`
      const probe = document.createElement('script');
      probe.innerHTML = `\nvar probeId = '${uuid}', probeOrigin = '${origin}';${probeScript}`;
      // Append probe script to html body
      const blob = new Blob([body, probe.outerHTML, style], {type});
      const url = URL.createObjectURL(blob);
      return `<iframe sandbox="allow-scripts" id="${uuid}" src="${url}"></iframe>`;
    default: return `<pre>Unknown part type: ${type}</pre>`
  }
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function validateLink (url) {
  // Add security checks here
  const pattern = /^(http|https):\/\/[^ "]+$/;
  if (!pattern.test(url)) {
    alert('Invalid url!')
    console.log('invalid url')
    return false;
  }
  if (!confirm(`You want to open ${url}?`)) {
    return false;
  }
  return true;
}

function messageListener (event) {
  // Since the iframe has a blob source, the event.origin will be 'null'.
  // This is cool as long as you don't add any unsafe™ handling in this listener.
  console.log(event.origin);
  const data = JSON.parse(event.data);
  const iframe = document.getElementById(data.id);
  switch (data.type) {
    case 'load':
    case 'resize':
      if (data.height && iframe) {
        iframe.style.height = `${data.height}px`;
      }
      break;
    case 'click':
      if (validateLink(data.href)) {
        // Better compability than window.open()
        // window.open(data.href);
        var link = document.createElement('a');
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
        link.href = data.href;
        link.open();
        console.log(event.source);
      }
      break;
  }
}