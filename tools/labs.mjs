export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p = text => `<p>${esc(text)}</p>`;
const details = (label, text) => `<details class="evidence-note"><summary>${esc(label)}</summary>${p(text)}</details>`;
export function bars(rows, max, unit = '') {
  return `<div class="bars">${rows.map(([label,value])=>`<div class="bar-row"><div class="bar-label"><span>${esc(label)}</span><strong>${value}${esc(unit)}</strong></div><div class="bar-track"><span style="width:${value/max*100}%"></span></div></div>`).join('')}</div>`;
}
function choices(id, tabs, intro='', cls='') {
  return `${intro}<div class="explorer ${cls}" data-explorer="${id}"><div class="choice-strip enhanced-only" role="group" aria-label="Explore ${id}">${tabs.map(([title],i)=>`<button type="button" data-choice="${i}" aria-pressed="${i===0}">${esc(title)}</button>`).join('')}</div><div class="panels">${tabs.map(([title,body],i)=>`<article class="lab-panel" data-panel="${i}"><span class="eyebrow">Perspective ${String(i+1).padStart(2,'0')}</span><h3>${esc(title)}</h3>${body}</article>`).join('')}</div><p class="sr-only" data-explorer-status aria-live="polite"></p></div>`;
}
function sort(id, heading, options, rows) {
  return `${p(heading)}<div data-sort="${id}"><div class="sort-list">${rows.map(([label,answer,why],i)=>`<div class="sort-row"><label for="${id}-${i}">${esc(label)}</label><select id="${id}-${i}" data-answer="${answer}" data-why="${esc(why)}"><option value="">Choose a category</option>${options.map((x,j)=>`<option value="${j}">${esc(x)}</option>`).join('')}</select><p class="sort-feedback" aria-live="polite"></p></div>`).join('')}</div><div class="action-row enhanced-only"><button type="button" class="solid" data-check-sort>Check the categories</button><button type="button" data-reset-sort>Try again</button></div><p class="feedback" data-sort-status aria-live="polite"></p></div>${details('Reference key & reasoning',rows.map(([label,answer,why])=>`${label}: ${options[answer]}. ${why}`).join(' '))}`;
}
const chartNote = text => `<p class="caption">${esc(text)}</p>`;

export function lab(reading) {
  switch(reading.id) {
    case 'Book-1-1': return {
      title:'Follow the research, question the result', type:'Research timeline',
      html: choices('research timeline', [
        ['1994–95 · Adolescence',p('Participants in grades 7–12 reported sports participation or plans to participate. The wider data set included 9,668 teens; the analysis focused on about 5,000 with at least one adverse childhood experience.')],
        ['2008 · Adulthood',p('The same people were asked about diagnoses of depression or anxiety and assessed for depressive symptoms. Following people over time establishes a sequence, but is not the same as randomly assigning a treatment.')],
        ['2019 · Reporting',p('Neilson connects the findings to an access problem: children who might benefit can be excluded by cost. The article reports an association and calls for broader participation.')]
      ],'<div class="timeline-rule" aria-hidden="true"><span>01</span><i></i><span>02</span><i></i><span>03</span></div>') + `<h3>The participation gap</h3>${bars([['Lower-income group',1],['Wealthier peers',2]],2,'×')}${chartNote('Normalized relative participation: 1:2. This visual does not represent absolute percentages. Aspen Institute 2018 report, as cited by Neilson.')}${details('What can this study not establish?','Sports may help, but family support and safety could influence both participation and wellbeing. The study does not establish sports as the sole cause or show exactly how any protective effect works.')}`
    };
    case 'Book-2-1': return {
      title:'Evidence, or a question still open?', type:'Classify the opening',
      html: sort('physical-psychological','Sort only what the available opening supports. A promised topic is different from a demonstrated finding.', ['Physical benefit','Physical risk','Psychological topic — not yet developed'], [
        ['More movement through participation',0,'The opening directly links sport with movement and health.'],
        ['Knee, shoulder and head injuries',1,'These are the physical concerns the paragraph names.'],
        ['The balance of psychological effects',2,'The opening announces this topic without supplying the body’s evidence.']
      ])
    };
    case 'Book-3-1': return {
      title:'A trainer’s work, on and off the field', type:'Task sorting',
      html: '<div class="field-key" aria-hidden="true"><span>ON THE FIELD<br>Immediate response</span><span>OFF THE FIELD<br>Recovery & development</span></div>' + sort('trainer-tasks','Assign each task to its context in the supplied excerpt.', ['On-field care','Off-field care'], [
        ['Quickly assess an injury during play',0,'The paragraph describes immediate assessment on the field.'],
        ['Attend to an injury under pressure',0,'Staying calm supports an immediate response during play.'],
        ['Guide an athlete through recovery',1,'Recovery is described as ongoing work away from the field.'],
        ['Help an athlete reach maximum physical performance',1,'The excerpt associates this with off-field training.']
      ]) + chartNote('The detailed methods used by Guerrero and the reasons for criticism are absent from the supplied text.')
    };
    case 'Book-4-1': return {
      title:'Look beyond the clock', type:'Hypothetical situations',
      html: choices('screen-use situations',[
        ['A long study session',p('Scenario: a student spends several hours researching, then sleeps, meets friends and finishes other responsibilities.')+details('What would the article ask?','Duration alone does not establish problematic use. Ask about purpose, control and interference with daily life. The scenario is hypothetical and cannot support a diagnosis.')],
        ['A disrupted routine',p('Scenario: a student repeatedly misses sleep and assignments to keep checking a feed, even when they intend to stop.')+details('What would the article ask?','Repeated interference with sleep and school is more relevant to the article’s reasoning than a time total alone. Context and other possible difficulties would still matter; this is not a diagnostic tool.')],
        ['A demanding group chat',p('Scenario: a student values online friendships but feels pressured to answer during family meals.')+details('What would the article ask?','Consider both the benefit of connection and the pressure of constant availability. The article supports examining habits and platform incentives together.')]
      ],'<div class="signal-diagram" aria-hidden="true"><span>TIME</span><b>+</b><span>CONTEXT</span><b>+</b><span>IMPACT</span></div>') + chartNote('Invented situations for interpreting the 2018 article. No health score, diagnosis or treatment recommendation is generated.')
    };
    case 'Book-5-1': return {
      title:'From a demo tape to a follower count', type:'Discovery pathways',
      html: choices('music discovery',[
        ['Earlier pathway', '<ol class="pipeline"><li>Demo tapes or live clubs</li><li>Listen to the music</li><li>Decide whether to invest</li></ol>'+p('The article’s historical comparison emphasizes discovery through listening. This is a simplified account of the process described by Vanderlip, not a claim that every label worked identically.')],
        ['Platform pathway','<ol class="pipeline"><li>Check the online audience</li><li>Evaluate the music</li><li>Market to existing fans</li></ol>'+p('An existing following can reduce a label’s perceived financial risk. The artist has already done part of the work of finding an audience.')]
      ])+ '<h3>Choose an artist’s perspective</h3>' + choices('artist perspectives',[
        ['VHS Collection',p('Vanderlip’s band values mystique and resists daily personal videos. The marketing request clashes with how the musicians want to present themselves.')],
        ['Lil Nas X',p('The article uses the viral spread of “Old Town Road” to illustrate how audience interaction can accelerate discovery. It does not guarantee that every viral artist earns a sustainable living.')],
        ['Damoyee',p('Her break from posting illustrates the workload and personal strain of keeping an audience engaged. Video production competes with other commitments.')]
      ])
    };
    case 'Book-6-1': return {
      title:'Choose a policy. Examine the trade-off.', type:'Argument matrix',
      html: choices('policy options',[
        ['Age checks','<div class="argument-pair"><div><h4>Intended benefit</h4>'+p('Restrict access for users below an age threshold.')+'</div><div><h4>Question to weigh</h4>'+p('How can ages be verified and the collected information protected? Enforcement and privacy complicate the goal.')+'</div></div>'],
        ['Parental consent','<div class="argument-pair"><div><h4>Intended benefit</h4>'+p('Give parents a formal role in access decisions.')+'</div><div><h4>Question to weigh</h4>'+p('Does the rule support family choice, or impose a government approach? The article presents disagreement about authority.')+'</div></div>'],
        ['Design limits','<div class="argument-pair"><div><h4>Intended benefit</h4>'+p('Address data collection and recommendation systems that keep users scrolling.')+'</div><div><h4>Question to weigh</h4>'+p('What can be implemented effectively, and how will companies respond when their business models are affected?')+'</div></div>'],
        ['Education','<div class="argument-pair"><div><h4>Intended benefit</h4>'+p('Help students understand safer and healthier social media use.')+'</div><div><h4>Question to weigh</h4>'+p('As an analytical extension, ask whether user knowledge alone addresses company incentives and design. The text does not rank these options for us.')+'</div></div>']
      ])+chartNote('This matrix interprets the supplied 2026 article. It does not state which rules are currently in force or select a legally correct policy.')
    };
    case 'Book-7-1': return {
      title:'Faster growth. Different questions.', type:'Compare & debate',
      html:`${bars([['AquAdvantage salmon',18],['Regular Atlantic salmon',36]],36,' months')}${chartNote('Time to readiness for food, as reported by CEO Ron Stotish in the 2014 article. Company claim, not an independent experiment in this portfolio.')}`+choices('salmon debate',[
        ['Food supply',p('Stotish argues that faster growth and a predictable farmed supply are benefits. A shorter growing period alone does not demonstrate the much broader claim that hunger would end.')],
        ['Health & evidence',p('The article reports company tests and the FDA’s assessment, alongside critics who ask for more information. Compare who is making a claim and what evidence supports its scope.')],
        ['Environment',p('Containment barriers are presented as safeguards. Critics ask what could happen to wild salmon and ecosystems if fish escape. The proposal’s effects depend partly on conditions of production.')],
        ['Public voice',p('Ecojustice questions the information available to decision-makers and the opportunity for public input. Scientific assessment and a legitimate decision process are connected but distinct questions.')]
      ])+details('Keep the publication timeline clear','The article was published in 2014 while approval was still contested. A later note in the supplied compilation reports U.S. approval in late 2015. This portfolio keeps those two moments separate.')
    };
    case 'Book-8-1': return {
      title:'Build an access picture', type:'Illustrative access scenario',
      html:`${p('Choose a setting and the barriers affecting this hypothetical household. The response matches obstacles with ideas from the article; it does not calculate a health risk.')}<div class="access-layout"><div><label for="food-setting">Setting</label><select id="food-setting" data-setting><option value="urban">Urban neighborhood</option><option value="rural">Rural community</option></select><fieldset class="barrier-options"><legend>Barriers to consider</legend>${[['distance','Distance to a store'],['transport','Limited transport'],['cost','Food is hard to afford'],['safety','Route feels unsafe']].map(([key,label])=>`<label><input type="checkbox" value="${key}" data-barrier${key==='transport'?' checked':''}> ${label}</label>`).join('')}</fieldset></div><div class="access-map"><svg viewBox="0 0 300 140" role="img" aria-label="Illustrative route between a home and a food shop"><path d="M45 100C100 100 75 40 150 60S210 110 255 55" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 7"/><path d="M20 77L45 57 70 77V108H20Z M230 40h50v55h-50z" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="132">HOME</text><text x="220" y="123">FOOD</text></svg><div data-access-result aria-live="polite"></div></div></div>${details('Static guide to barriers & responses','Distance: consider a fresh-food store or support an existing shop. Transport: grocery trips or delivery may help. Cost: closer food is not necessarily affordable, so poverty must also be addressed. Safety: safer routes can make walking or taking transit more practical. Rural stores may also face limited demand and higher stocking costs.')}`
    };
    case 'Book-1-2': return {
      title:'A timeline of debt and uncertainty', type:'Case timeline & earnings',
      html: choices('Husband case timeline',[
        ['2009 · Conviction',p('The report dates Husband’s embezzlement conviction to 2009. Probation and monthly payments put financial conditions on remaining outside prison.')],
        ['2015 · Restitution center',p('Husband enters Flowood in May. The court order requires payment of a $12,685.50 balance. Room-and-board costs and low wages make a release date difficult to foresee.')],
        ['July 2015 · Escape',p('Husband leaves after being dropped at work. The investigation later estimates that paying off her debt at her earnings rate would have taken more than a year and a half.')],
        ['Later consequences',p('After she is found, Husband serves almost ten months in prison. The report describes debt still exceeding $10,000 when she finishes parole, demonstrating a consequence beyond the time confined.')]
      ])+`<h3>Where reported earnings went</h3><div class="allocation" role="img" aria-label="25 percent restitution; 75 percent corrections department and courts"><span>25%</span><span>75%</span></div><div class="allocation-legend"><span>Restitution</span><span>Corrections department & courts</span></div>${chartNote('Aggregate earnings, July 2014–June 2018, from state data reported by Wolfe and Liu. The 75% is the remainder of the reported quarter allocated to restitution. This is not Husband’s personal paycheck.')}${details('Why this chart needs a limit','An aggregate allocation does not show each person’s payments or identify every fee within the remainder. It cannot be used to calculate an individual’s release date.')}`
    };
    case 'Book-2-2': return {
      title:'Put the speed difference in context', type:'Shared-space scenarios',
      html:`${bars([['Electric scooter',15],['Walking — lower reported value',3],['Walking — upper reported value',4]],15,' mph')}${chartNote('Speeds reported by Sallis in 2018. They explain a difference in pace, not an estimated probability of injury.')}`+choices('route choices',[
        ['Sidewalk',p('Sallis prioritizes pedestrians and makes an exception for mobility devices used by disabled people. Mixing fast rideables with walkers creates the conflict at the center of his argument.')],
        ['Protected bike lane',p('A protected route offers a possible shared space for bicycles and rideables. Sallis proposes cooperation to build these facilities; the article does not establish that every existing lane is suitable.')],
        ['Street',p('The author allows rideables where bicycles are legal but acknowledges that streets may be unsafe. Moving riders off sidewalks alone does not solve their exposure to traffic.')]
      ])
    };
    case 'Book-3-2': return {
      title:'Read the commute through Alex’s eyes', type:'Perspective journey',
      html:'<div class="journey-line" aria-hidden="true">Street <span>→</span> Gate <span>→</span> Ramp <span>→</span> Train</div>'+choices('commute moments',[
        ['Street',p('Obstacle: uneven paving, crowds and objects at face level. Response: Alex draws on knowledge of the route and practiced control of the chair. The narration emphasizes skill rather than helplessness.')],
        ['Gate',p('Obstacle: a bicycle blocks the only wide gate. Response: Alex asks politely and restrains their frustration when told to wait. Access exists in theory but is obstructed in practice.')],
        ['Ramp',p('Obstacle: the attendant arrives too late for the first train. Response: Alex waits and is soaked by rain. Their extra planning cannot compensate for every failure of assistance.')],
        ['Train',p('Obstacle: luggage occupies the wheelchair space and a stranger offers patronizing attention. Response: Alex claims the space and ends the interaction. Their actions protect both access and autonomy.')]
      ])+chartNote('A close-reading journey, not a simulation of disability. The text centers Alex’s agency; no points are awarded for overcoming barriers.')
    };
    case 'Book-4-2': return {
      title:'The route that went nowhere', type:'Sequence & schematic',
      html:'<div class="snow-map"><svg viewBox="0 0 500 180" role="img" aria-label="An illustrative loop returning near the inn, followed by a route whose tracks fade"><path d="M90 100C80 10 245 10 245 95S95 175 90 100M245 95Q310 40 390 85" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 6"/><path d="M390 85l60 25" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="1 12"/><circle cx="90" cy="100" r="7" fill="currentColor"/><text x="26" y="145">NEAR THE INN</text><text x="132" y="93">THE LOOP</text><text x="330" y="145">FADING TRACKS</text></svg></div>'+chartNote('Illustrative schematic only. No scale, compass direction or geographical reconstruction is claimed.')+sort('snow-order','Put the four major episodes in their narrative order.', ['1 · First','2 · Second','3 · Third','4 · Last'],[
        ['The fire fails and the horses are lost',3,'The final attempt follows their decision to stop and camp.'],
        ['Ollendorff promises reliable direction',0,'The opening establishes confidence in his instinct.'],
        ['Stagecoach tracks disappear into misleading shrub rows',2,'This is the second loss of direction, after the circular route.'],
        ['The travelers recognize their own tracks',1,'They discover the loop before following the stagecoach.']
      ])
    };
    case 'Book-5-2': return {
      title:'Where do people locate home?', type:'Survey explorer',
      html:`${p('Select a bar to explore what that answer adds to the meaning of home.')}<div class="survey">${[['Born or raised',26],['Currently live',22],['Lived longest',18],['Extended family roots',15]].map(([label,value],i)=>`<button class="survey-row" type="button" data-survey="${i}" aria-pressed="${i===0}"><span>${label}</span><span class="survey-track"><span style="width:${value/30*100}%"></span></span><strong>${value}%</strong></button>`).join('')}</div><div class="survey-result" data-survey-result aria-live="polite">Born or raised: early experiences can continue to anchor belonging even after a person moves.</div>${chartNote('Selected responses to a 2008 Pew study, as reported by McAndrew. These four values total 81%; they are not an exhaustive distribution and do not represent this class.')}${details('All four interpretations','Born or raised: childhood memories can anchor belonging. Currently live: present routines and relationships can define home. Lived longest: accumulated experience can create attachment. Extended family roots: belonging can be tied to family history beyond a current address.')}`
    };
    case 'Book-6-2': return {
      title:'Keep, change, create', type:'Tradition cards',
      html:choices('tradition choices',[
        ['Keep · A shared meal',p('Lyall keeps gathering people around food and gratitude. The continuity is in connection even when the day, dishes and guests change.')],
        ['Change · The rules',p('She moves the celebration to a convenient day and removes dishes she dislikes. Her playful tone makes adaptation feel liberating rather than like a failure of tradition.')],
        ['Create · A personal menu',p('She introduces desserts and decorations that suit her own tastes. Calling a dish traditional becomes an act of making meaning rather than following an inherited checklist.')]
      ])+`<details class="turning-point"><summary>Turn the page: why the apple pie matters <span>↗</span></summary><div><span class="eyebrow">The emotional turning point</span>${p('The pie recalls Connie, a friend who shared it with Lyall during their early reporting careers and later gave her the cookbook. After Connie’s death, making it carries affection and remembrance into a new setting. The essay moves from comic freedom to a tender form of continuity.')}</div></details>`
    };
    case 'Book-7-2': return {
      title:'A season of preparation and renewal', type:'Customs timeline',
      html:choices('Tết timeline',[
        ['01 · Prepare',p('Graf describes cleaning, new clothes, settling debts and disagreements, and preparing food. Flowers and fruit trees are connected with welcoming good spirits and hopes for fruitfulness.')+details('Kitchen Gods & cây nêu','In the text’s account, the Kitchen Gods depart before Tết and return at the holiday. Decorated bamboo poles are described as protection while they are away. Red is associated with luck and happiness.')],
        ['02 · Welcome',p('The article describes families gathering and sounds marking the beginning of the holiday. Beliefs about the first visitor connect the arrival of a person with hopes for the year.')+details('Why avoid sweeping?','Graf describes a belief that sweeping during Tết could sweep away good fortune. This explains the symbolic contrast between cleaning before the holiday and avoiding it during the celebration.')],
        ['03 · Celebrate',p('Lucky-money envelopes, visits and festive performances are described as expressions of hope, connection and prosperity.')+details('Read cultural scope carefully','These customs are presented as Graf’s 2012 account. Families and communities may differ. The activity avoids repeating disputed recipe and origin-story details from the source as established facts.')]
      ])+chartNote('A sequence of customs from the reading, not a calendar for a specific year or a universal account of Vietnamese practice.')
    };
  }
}
