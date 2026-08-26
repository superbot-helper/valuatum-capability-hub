const cards = [...document.querySelectorAll('[data-capability]')];
const query = document.querySelector('#search');
const status = document.querySelector('#status');
const family = document.querySelector('#family');

function filterCapabilities() {
  const text = (query?.value || '').toLowerCase();
  cards.forEach(card => {
    const textMatches = card.textContent.toLowerCase().includes(text);
    const statusMatches = !status?.value || card.dataset.status === status.value;
    const familyMatches = !family?.value || card.dataset.family === family.value;
    card.hidden = !(textMatches && statusMatches && familyMatches);
  });
}

[query, status, family].forEach(element => element?.addEventListener('input', filterCapabilities));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  navigation?.classList.toggle('open', !open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const contexts = {
  supplier: 'Toimittajan arviointi',
  credit: 'Luottopäätös',
  'acquisition-screening': 'Yritysostokohteen esiarviointi',
  general: 'Yleinen tarkastelu'
};
const riskLevels = { 'very low': 'erittäin matala', low: 'matala', moderate: 'kohtalainen', elevated: 'kohonnut', high: 'korkea' };
const industries = {
  'Industrial components': 'Teollisuuskomponentit',
  'Data software': 'Dataohjelmistot',
  Logistics: 'Logistiikka',
  'Food distribution': 'Elintarvikejakelu',
  'Specialty retail': 'Erikoisvähittäiskauppa',
  'Energy technology': 'Energiateknologia'
};
const driverTranslations = {
  'Profitable three-year operating history': 'Kannattava kolmen vuoden toimintahistoria',
  'Equity ratio remains solid': 'Omavaraisuusaste on säilynyt vahvana',
  'Debt increased moderately with investment': 'Velka kasvoi maltillisesti investoinnin yhteydessä',
  'Rapid revenue growth': 'Nopea liikevaihdon kasvu',
  'Recently reached operating profitability': 'Liiketoiminta on saavuttanut hiljattain kannattavuuden',
  'Cash buffer declined while debt increased': 'Kassapuskuri pieneni velan kasvaessa',
  'High leverage': 'Korkea velkaantuneisuus',
  'Declining operating margin': 'Heikkenevä liikevoittomarginaali',
  'Thin cash buffer': 'Ohut kassapuskuri',
  'Stable profitability': 'Vakaa kannattavuus',
  'Strengthening equity': 'Vahvistuva oma pääoma',
  'Declining debt': 'Pienenevä velkamäärä',
  'Revenue decline': 'Liikevaihdon lasku',
  'Operating loss': 'Liiketappio',
  'Weakening liquidity and equity': 'Heikkenevä maksuvalmius ja oma pääoma',
  'Growing revenue and earnings': 'Kasvava liikevaihto ja tulos',
  'Healthy equity base': 'Vahva oman pääoman asema',
  'Manageable leverage': 'Hallittava velkaantuneisuus'
};
const summaries = {
  'northstar-components-oy': 'Vakiintunut komponenttivalmistaja investoi uuteen tuotantolinjaan.',
  'aurora-analytics-oy': 'Nopeasti kasvava analytiikkayhtiö on saavuttanut juuri kannattavuuden, mutta kassavarat ovat pienentyneet.',
  'granite-logistics-ab': 'Alueellinen logistiikkayhtiö toimii suuren kalustorahoituksen varassa.',
  'harbor-foods-as': 'Vakaa ja kypsä elintarvikejakelija kasvaa maltillisesti.',
  'ember-retail-aps': 'Vähittäiskauppaketju kärsii laskevasta myymäläliikenteestä ja uudelleenjärjestelykuluista.',
  'polar-grid-plc': 'Kuvitteellinen listattu energiateknologiayhtiö kasvaa kansainvälisesti.'
};

const euros = value => new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const form = document.querySelector('#demo-form');

form?.addEventListener('submit', async event => {
  event.preventDefault();
  const output = document.querySelector('#demo-output');
  output.textContent = 'Koostetaan synteettistä päätösmuistiota…';
  const base = document.body.dataset.apiBase || 'http://localhost:8080';
  try {
    const response = await fetch(`${base}/api/create_decision_brief`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ company_id: form.company_id.value, decision_context: form.decision_context.value })
    });
    const value = await response.json();
    if (!response.ok) throw new Error(value.error || 'Tuntematon palveluvirhe');
    output.textContent = [
      'SYNTEETTINEN PÄÄTÖSMUISTIO', '',
      `Konteksti: ${contexts[value.decisionContext] || value.decisionContext}`,
      `Yritys: ${value.company.name}`,
      `Maa ja toimiala: ${value.company.country} · ${industries[value.company.industry] || value.company.industry}`, '',
      'YHTEENVETO', summaries[value.company.id] || value.summary, '',
      'TALOUDELLINEN TILANNE',
      `Liikevaihto: ${euros(value.financialCondition.latest.turnover)}`,
      `Liikevoitto: ${euros(value.financialCondition.latest.operatingResult)}`,
      `Liikevaihdon kasvu: ${value.financialCondition.turnoverGrowthPercent} %`,
      `Omavaraisuusaste: ${value.financialCondition.latest.ratios.equityRatio} %`, '',
      'LUOTTORISKI',
      `Luokitus: ${value.creditRisk.rating}`,
      `Riskitaso: ${riskLevels[value.creditRisk.riskLevel] || value.creditRisk.riskLevel}`,
      `Luottamus: ${Math.round(value.creditRisk.confidence * 100)} %`,
      `Keskeiset tekijät: ${value.creditRisk.drivers.map(driver => driverTranslations[driver] || driver).join('; ')}`, '',
      'ARVONMÄÄRITYSKONTEKSTI',
      `Havainnollinen vaihteluväli: ${euros(value.valuationContext.low)}–${euros(value.valuationContext.high)}`,
      `Keskipiste: ${euros(value.valuationContext.midpoint)}`, '',
      'EPÄVARMUUDET',
      '• Synteettiset luvut eivät osoita todellista luottokelpoisuutta tai yrityksen arvoa.',
      '• Mukana ei ole laadullista yritystarkastusta, oikeudellista arviota, maksuhistoriaa tai ajantasaista markkinatietoa.', '',
      'JATKOKYSYMYKSET',
      '• Kuinka suuri vastuu ja millaiset maksuehdot ovat kyseessä?',
      '• Mitkä viimeaikaiset tapahtumat eivät näy historiatiedoissa?',
      '• Mitkä ihmisen hyväksynnät ja ulkoiset tarkistukset tarvitaan?', '',
      'Prototyyppi / synteettinen aineisto. Ei Valuatumin todellinen arvio.'
    ].join('\n');
  } catch (error) {
    output.textContent = `Live-palvelu ei ole käytettävissä. Yritä hetken kuluttua uudelleen.\n\n${error.message}`;
  }
});
