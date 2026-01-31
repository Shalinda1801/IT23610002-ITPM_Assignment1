
const { test, expect } = require('@playwright/test');

test.describe('SwiftTranslator Singlish → Sinhala (from Excel) - V3', () => {
  const baseURL = 'https://www.swifttranslator.com/';

  function normalizeSinhala(input) {
    if (input === null || input === undefined) return '';
    let s = String(input);

    
    s = s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');

    
    s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    
    s = s.replace(/[\t\f\v ]+/g, ' ');
    s = s.replace(/ *\n */g, '\n');
    s = s.replace(/\n{3,}/g, '\n\n');

   
    s = s
      .replace(/ \./g, '.')
      .replace(/ \?/g, '?')
      .replace(/ \!/g, '!')
      .replace(/ ,/g, ',')
      .replace(/ ;/g, ';')
      .replace(/ :/g, ':');

    // Normalize number + 'ක්'
    s = s.replace(/(\d)\s*ක්/g, '$1ක්');

    // Lowercase latin letters to avoid Zoom/zoom etc.
    s = s.replace(/[A-Z]/g, (c) => c.toLowerCase());

    // Trim and remove trailing sentence punctuation
    s = s.trim().replace(/[.!?]+$/g, '');

    // Canonicalize some common Sinhala variants
    s = s
      .replace(/පුලුවන්ද/g, 'පුළුවන්ද')
      .replace(/පුලුවන්/g, 'පුළුවන්')
      .replace(/පුලුවන/g, 'පුළුවන')
      .replace(/ඔයාගෙ/g, 'ඔයාගේ')
      .replace(/ඔයාලගෙ/g, 'ඔයාලගේ')
      .replace(/ඊයෙ/g, 'ඊයේ')
      .replace(/හොද/g, 'හොඳ')
      .replace(/\bනෑ\b/g, 'නැහැ')
      .replace(/\bනැ\b/g, 'නැහැ');

    // Final collapse spaces
    s = s.replace(/[ ]{2,}/g, ' ').trim();

    return s;
  }

  async function waitForStableText(locator, timeoutMs = 15000, stableMs = 500) {
    const start = Date.now();
    let last = null;
    let lastChange = Date.now();

    while (Date.now() - start < timeoutMs) {
      const t = (await locator.textContent()) ?? '';
      const cur = t.trim();

      if (cur !== last) {
        last = cur;
        lastChange = Date.now();
      } else {
        if (cur && Date.now() - lastChange >= stableMs) return cur;
      }

      await locator.page().waitForTimeout(120);
    }

    return ((await locator.textContent()) ?? '').trim();
  }

  async function convertInput(page, inputText) {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    const inputLocator = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
    await inputLocator.waitFor({ state: 'visible', timeout: 15000 });

    await inputLocator.fill('');
    await inputLocator.fill(inputText);

    const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
    await outputLocator.waitFor({ state: 'visible', timeout: 15000 });

    await expect(outputLocator).not.toHaveText('', { timeout: 15000 });

    const stableRaw = await waitForStableText(outputLocator, 15000, 500);
    return stableRaw;
  }

  //  Total 35: Pos 24 + Neg 10 + UI Pos 1
  const cases = [
    //  POS 24 
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
    { id: 'Pos_Fun_0024', input: 'adha udhee mama town yanna kalin breakfast gaththa. passe yadhdhii traffic  nisaa mama late unaa. manager ta call karala kivva mama dhaen enavaa kiyala. eeta passe meeting thibba nisa vaeda godak thibbaa.havasa  gedhara giyaama podi rest ekak ganna oone kiyala hithuna. api passe kathaa karamu kiyala mama message ekak dhaemmaa', expected: 'අද උදේ මම town යන්න කලින් breakfast ගත්ත. පස්සෙ යද්දී traffic  නිසා මම late උනා. manager ට call කරල කිව්ව මම දැන් එනවා කියල. ඒට පස්සෙ meeting තිබ්බ නිස වැඩ ගොඩක් තිබ්බා.හවස  ගෙදර ගියාම පොඩි rest එකක් ගන්න ඕනෙ කියල හිතුන. අපි පස්සෙ කතා කරමු කියල මම message එකක් දැම්මා' },

    
    
    //Negative Functional 10 
    { id: 'Neg_Fun_0025', input: 'adhaaapiyanawaa', expected: 'අද අපි යනවා' },
    { id: 'Neg_Fun_0026', input: 'matakaamaonee', expected: 'මට කෑම ඕනේ' },
    { id: 'Neg_Fun_0027', input: 'mmaa gdhr ynwa', expected: 'මම ගෙදර යනවා' },
    { id: 'Neg_Fun_0028', input: 'mama gedhara yanawaa @@### oyaath enawada??', expected: 'මම ගෙදර යනවා @@### ඔයත් එනවද???' },
    { id: 'Neg_Fun_0029', input: 'm a m a g e d h a r a y a n a w a a', expected: 'ම ම ගෙ ද ර ය න වා' },
    { id: 'Neg_Fun_0030', input: 'aneeee mata oneeee!', expected: 'අනේ මට ඕනේ' },
    { id: 'Neg_Fun_0031', input: '“oyaata” kiyala kiyannawada? (mama sure na!)', expected: '"ඔයාට" කියල කියනවද?(මම sure නෑ)' },
    { id: 'Neg_Fun_0032', input: 'OS eke prashana nisa system awul yanawa', expected: 'OS එකේ ප්‍රශ්න නිසා system අවුල් යනවා' },
    { id: 'Neg_Fun_0033', input: 'mama gedhara inne.\n\noyaa koheda inne?\n\napi passe kathaa karamu', expected: 'මම ගෙදර ඉන්නේ.\n\nඔයා කොහෙද ඉන්නේ?\n\අපි පස්සෙ කතා කරමු' },
    { id: 'Neg_Fun_0034', input: 'ada ude phone eka charge nathi nisa panic wela, road eke traffic sudden wadi una, ride app eka open karala try karaddi location eka hariyata update wenne na, notification tika pop up wenawa, man eeke type karana msg eka podi podi kaali walata kadenawa , ehema input ekak thibboth system eka meeka correct widihata process karagannawada nathnam output eka confuse wenawada kiyala balanna one', expected: 'අද උදේ ෆෝන් එක චාර්ජ් නැති නිසා panic වෙලා,road එකේ traffic sudden වැඩි උනා,ride app එක open කරලා try කරද්දි location එක හරියට update වෙන්නේ නෑ ,notification ටික popup වෙනවා,මන් එකේ type කරන msg එක පොඩි පොඩි කෑලි වලට කැඩෙනවා,එහෙම input එකක් තිබ්බොත් system එක මේක  correct විදියට process කරගන්නවද නැත්නම් output එක confuse වෙනවද කියල බලන්න ඕනේ' },

    //  UI POS 1 
    { id: 'Pos_UI_0035', input: 'adha office yanna late unaa', expected: 'Sinhala output should update automatically while typing and display: අද office යන්න late උනා' }
  ];

  for (const tc of cases) {
    if (tc.id.startsWith('Pos_UI_')) {
      test(`${tc.id} UI - realtime output updates`, async ({ page }) => {
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        const inputLocator = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
        await inputLocator.waitFor({ state: 'visible', timeout: 15000 });

        await inputLocator.fill('');
        await inputLocator.type(tc.input, { delay: 40 });

        const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
        await outputLocator.waitFor({ state: 'visible', timeout: 15000 });

        await expect(outputLocator).not.toHaveText('', { timeout: 15000 });
        const stableRaw = await waitForStableText(outputLocator, 15000, 500);

        const actual = normalizeSinhala(stableRaw);

        const m = String(tc.expected).match(/display\s*:\s*(.*)$/i);
        const expectedSinhala = normalizeSinhala(m ? m[1] : tc.expected);

        expect(actual).toBe(expectedSinhala);
      });

      continue;
    }

    test(`${tc.id} ${tc.id.startsWith('Pos_') ? 'Positive' : 'Negative'} Functional`, async ({ page }) => {
      const actualRaw = await convertInput(page, tc.input);
      const actual = normalizeSinhala(actualRaw);
      const expected = normalizeSinhala(tc.expected);

      try {
        
        expect(actual).toBe(expected);
      } catch (e) {
        console.log(`\n[${tc.id}] INPUT   : ${tc.input}`);
        console.log(`[${tc.id}] EXPECTED: ${tc.expected}`);
        console.log(`[${tc.id}] ACTUAL  : ${actualRaw}`);
        throw e;
      }
    });
  }
   
});