import {esc} from './markup.mjs';
import {navigation, route} from './navigation.mjs';

export function header(ctx) {
  const logo = `<svg viewBox="0 0 40 46" aria-hidden="true">
    <path d="M3 4h34v38H3z" fill="none" stroke="currentColor"/>
    <path d="M9 12q6-3 11 0 5-3 11 0v22q-6-3-11 0-5-3-11 0zM20 12v22M12 18h5M23 18h5M12 23h5M23 23h5" fill="none" stroke="currentColor"/>
  </svg><span>Between<br>the Lines.</span>`;
  const currentPath = ctx.path === 'Home/index.html' ? 'index.html' : ctx.path;
  const links = navigation.map(([name, target]) =>
    route(ctx, target, esc(name), currentPath === target ? 'aria-current="page"' : '')
  );

  return `<a class="skip-link" href="#${ctx.root}-main">Skip to content</a>
  <header class="masthead">
    ${route(ctx, 'index.html', logo, 'class="brand" aria-label="Between the Lines — Home"')}
    <nav aria-label="Portfolio">${links.join('')}</nav>
    <div class="edition">A GRADE 12 READING PORTFOLIO<br>12E4 · 2026—2027</div>
  </header>`;
}
