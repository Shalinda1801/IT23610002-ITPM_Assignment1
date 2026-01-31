
const { test, expect } = require('@playwright/test');

test.describe('SwiftTranslator Singlish → Sinhala', () => {

  const baseURL = 'https://www.swifttranslator.com/'; 


  async function convertInput(page, inputText) {
    await page.goto(baseURL);

    // Fill the Singlish input box
    await page.fill(
      'textarea[placeholder="Input Your Singlish Text Here."]',
      inputText
    );

    // Wait for output div to appear and have text
    const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
    await outputLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(outputLocator).not.toHaveText('', { timeout: 5000 });

    // Get the Sinhala text
    const actual = await outputLocator.textContent();
    return actual.trim();
  }

  //Positive Functional (24 cases) 
  const positiveCases = [
    { id: 'Pos_Fun_0001', input: 'suba sathiyak!', expected: 'සුබ සතියක්!' },
    { id: 'Pos_Fun_0002', input: 'suba udhaesanak!', expected: 'සුබ උදැසනක්!' },
    { id: 'Pos_Fun_0003', input: 'kohomadha sathiya?', expected: 'කොහොමද සතිය?' },
    { id: 'Pos_Fun_0004', input: 'mama pansalee innee', expected: 'මම පන්සලේ ඉන්නේ' },
    { id: 'Pos_Fun_0005', input: 'mata udhavvak karanna puluvandha?', expected: 'මට උදව්වක් කරන්න පුලුවන්ද?' },
    { id: 'Pos_Fun_0006', input: 'pitipassata enna', expected: 'පිටිපස්සට එන්න' },
    { id: 'Pos_Fun_0007', input: 'mama  bath kanne naehae', expected: 'මම  බත් කන්නෙ නැහැ' },
    { id: 'Pos_Fun_0008', input: 'mama iiyee paasal giyaa', expected: 'මම ඊයේ පාසල් ගියා' },
    { id: 'Pos_Fun_0009', input: 'api heta pansal yamu', expected: 'අපි හෙට පන්සල් යමු' },
    { id: 'Pos_Fun_0010', input: 'api heta gedhara yamu', expected: 'අපි හෙට ගෙදර යමු' },
    { id: 'Pos_Fun_0011', input: 'mama chithra adhii saha paata karayi', expected: 'මම චිත්‍ර අදී සහ පාට කරයි' },
    { id: 'Pos_Fun_0012', input: 'oyaa kaemathinam nam api kanna yamu', expected: 'ඔයා කැමතිනම් නම් අපි කන්න යමු' },
    { id: 'Pos_Fun_0013', input: 'karunaakarala mata meeka kiyala dhenna haekidha?', expected: 'කරුනාකරල මට මේක කියල දෙන්න හැකිද?' },
    { id: 'Pos_Fun_0014', input: 'eeyi, araka karanna', expected: 'ඒයි, අරක කරන්න' },
    { id: 'Pos_Fun_0015', input: 'podda podda karamu', expected: 'පොඩ්ඩ පොඩ්ඩ කරමු' },
    { id: 'Pos_Fun_0016', input: 'mata bath kanna oonee', expected: 'මට බත් කන්න ඕනේ' },
    { id: 'Pos_Fun_0017', input: 'adha WiFi connection naehae, router eka restart karala balanna', expected: 'අද WiFi connection නැහැ, router එක restart කරල බලන්න' },
    { id: 'Pos_Fun_0018', input: 'magee NIC eka haelila', expected: 'මගේ NIC එක හැලිල' },
    { id: 'Pos_Fun_0019', input: 'api colombo yanna hadhanne ,traffic nisaa leesi nahae yanna', expected: 'අපි colombo යන්න හදන්නෙ ,traffic නිසා ලේසි නහැ යන්න' },
    { id: 'Pos_Fun_0020', input: 'Rs. 6000 k dhaeriya haekidha?', expected: 'Rs. 6000 ක් දැරිය හැකිද?' },
    { id: 'Pos_Fun_0021', input: '2026-05-31  patan gamu', expected: '2026-05-31  පටන් ගමු' },
    { id: 'Pos_Fun_0022', input: '7.30 AM  ta paarata enna', expected: '7.30 AM  ට පාරට එන්න' },
    { id: 'Pos_Fun_0023', input: 'mama    heta   gedhara  yannemi', expected: 'මම    හෙට   ගෙදර  යන්නෙමි' },
    { id: 'Pos_Fun_0024', input: 'adha udhee mama town yanna kalin breakfast gaththa. passe yadhdhii traffic  nisaa mama late unaa. manager ta call karala kivva mama dhaen enavaa kiyala. eeta passe meeting thibba nisa vaeda godak thibbaa.havasa  gedhara giyaama podi rest ekak ganna oone kiyala hithuna. api passe kathaa karamu kiyala mama message ekak dhaemmaa',
       expected: 'අද උදේ මම town යන්න කලින් breakfast ගත්ත. පස්සෙ යද්දී traffic  නිසා මම late උනා. manager ට call කරල කිව්ව මම දැන් එනවා කියල. ඒට පස්සෙ meeting තිබ්බ නිස වැඩ ගොඩක් තිබ්බා.හවස  ගෙදර ගියාම පොඩි rest එකක් ගන්න ඕනෙ කියල හිතුන. අපි පස්සෙ කතා කරමු කියල මම message එකක් දැම්මා' },
  ];

  for (const tc of positiveCases) {
    test(`${tc.id} Positive Functional`, async ({ page }) => {
      const actual = await convertInput(page, tc.input);
      expect(actual).toBe(tc.expected);
    });
  }

  //Negative Functional (10 cases)
  const negativeCases = [
  { id: 'Neg_Fun_0001', input: 'adhaaapiyanawaa', correct: 'අද අපි යනවා' },
  { id: 'maNeg_Fun_0002', input: 'matakaamaonee', correct: 'මට කෑම ඕනේ' },
  { id: 'Neg_Fun_0003', input: 'mmaa gdhr ynwa', correct: 'මම ගෙදර යනවා' },
  { id: 'Neg_Fun_0004', input: 'mama gedhara yanawaa @@### oyaath enawada??', correct: 'මම ගෙදර යනවා @@### ඔයත් එනවද???' },
  { id: 'Neg_Fun_0005', input: 'm a m a g e d h a r a y a n a w a a', correct: 'ම ම ගෙ ද ර ය න වා' },
  { id: 'Neg_Fun_0006', input: 'aneeee mata oneeee!', correct: 'අනේ මට ඕනේ' },
  {
    id: 'Neg_Fun_0007',
    input: '“oyaata” kiyala kiyannawada? (mama sure na!)',
    correct: '"ඔයාට" කියල කියනවද?(මම sure නෑ)'
  },
  {
    id: 'Neg_Fun_0008',
    input: 'OS eke prashana nisa system awul yanawa',
    correct: 'OS එකේ ප්‍රශ්න නිසා system අවුල් යනවා'
  },
  {
    id: 'Neg_Fun_0009',
    input: 'mama gedhara inne.\n\noyaa koheda inne?\n\napi passe kathaa karamu',
    correct: 'මම ගෙදර ඉන්නේ.\n\nඔයා කොහෙද ඉන්නේ?\n\අපි පස්සෙ කතා කරමු'
  },
  {
    id: 'Neg_Fun_0010',
    input: 'ada ude phone eka charge nathi nisa panic wela, road eke traffic sudden wadi una, ride app eka open karala try karaddi location eka hariyata update wenne na, notification tika pop up wenawa, man eeke type karana msg eka podi podi kaali walata kadenawa , ehema input ekak thibboth system eka meeka correct widihata process karagannawada nathnam output eka confuse wenawada kiyala balanna one',
    correct: 'අද උදේ ෆෝන් එක චාර්ජ් නැති නිසා panic වෙලා,road එකේ traffic sudden වැඩි උනා,ride app එක open කරලා try කරද්දි location එක හරියට update වෙන්නේ නෑ ,notification ටික popup වෙනවා,මන් එකේ type කරන msg එක පොඩි පොඩි කෑලි වලට කැඩෙනවා,එහෙම input එකක් තිබ්බොත් system එක මේක  correct විදියට process කරගන්නවද නැත්නම් output එක confuse වෙනවද කියල බලන්න ඕනේ'
  },
];

for (const tc of negativeCases) {
  test(`${tc.id} Negative Functional`, async ({ page }) => {
    const actual = await convertInput(page, tc.input);

    expect(actual).not.toBe(tc.correct);
  });
}

  test('Pos_UI_0001 Real-time Sinhala output updates while typing', async ({ page }) => {
    const input = 'adha office yanna late unaa';
    await page.goto(baseURL);

    // Fill input
    await page.fill(
      'textarea[placeholder="Input Your Singlish Text Here."]',
      input
    );

    // Wait for output to update dynamically
    const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
    await outputLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(outputLocator).not.toHaveText('', { timeout: 5000 });

    const output = await outputLocator.textContent();

    // Expected value is correct Sinhala
    expect(output.trim()).toBe('අද office යන්න late උනා');
  });

});