/* WhatsApp requires country code + number, with no plus sign or spaces. */
const WHATSAPP_NUMBER = '254711337565';
const form = document.querySelector('#booking-form');
const dateInput = document.querySelector('#date');

function localDateToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function updateMinDate() { dateInput.min = localDateToday(); }
updateMinDate();
dateInput.addEventListener('focus', updateMinDate);
form.addEventListener('input', (event) => {
  event.target.setCustomValidity('');
  document.querySelector('#booking-status').hidden = true;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateMinDate();
  for (const name of ['name', 'placement']) {
    const input = form.elements.namedItem(name);
    input.value = input.value.trim();
    input.setCustomValidity(input.value ? '' : 'Please fill in this field.');
  }
  dateInput.setCustomValidity(dateInput.value && dateInput.value < dateInput.min ? 'Please choose today or a future date.' : '');
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const contact = data.get('contact').trim();
  const idea = data.get('idea').trim();
  // Parse as local time to avoid shifting the selected calendar day.
  const readableDate = new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const lines = [
    'Hi Mwasaru Inks! I’d like to request a tattoo appointment.',
    '',
    `Name: ${data.get('name')}`,
    `Placement: ${data.get('placement')}`,
    `Preferred date: ${readableDate}`,
    ...(contact ? [`Contact: ${contact}`] : []),
    ...(idea ? [`Idea: ${idea}`] : []),
    '',
    'Please confirm your availability and deposit details.'
  ];
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  document.querySelector('#whatsapp-fallback').href = url;
  document.querySelector('#booking-status').hidden = false;
  // This only opens a draft. The customer sends it inside WhatsApp.
  window.open(url, '_blank', 'noopener,noreferrer');
});
