import { route } from "./navigation.mjs";

const homepage = "https://crepmc.github.io/";
const profile = "https://github.com/CrepMC";
const contactEmail = "nhan069069@stu.vinschool.edu.vn";

export function footer(ctx) {
  const projectLink =
    ctx.path === "index.html" || ctx.path === "Home/index.html"
      ? '<a href="#about-project">About this project</a>'
      : route(ctx, "index.html#about-project", "About this project");

  return `<footer class="site-footer">
    <div class="footer-grid">
      <section>
        <h2>Contact</h2>
        <p>CrepMC · Grade 12 Reading Portfolio</p>
        <a href="mailto:${contactEmail}" target="_blank" rel="noopener">${contactEmail}</a>
      </section>
      <section>
        <h2>Legal</h2>
        <p>This portfolio is for educational use. Quoted material remains the property of its respective rights holders.</p>
        <p class="footer-copyright">© 2026 CrepMC</p>
      </section>
      <section class="footer-updates">
        <h2>Updates</h2>
        <p>Follow CrepMC for new projects and updates.</p>
        <a class="footer-follow" href="${profile}" target="_blank" rel="noopener">Follow on GitHub <span aria-hidden="true">↗</span></a>
      </section>
      <nav aria-label="Footer pages">
        <h2>Pages</h2>
        <ul>
          <li><a href="${homepage}" target="_blank" rel="noopener">CrepMC homepage <span aria-hidden="true">↗</span></a></li>
          <li>${projectLink}</li>
        </ul>
      </nav>
    </div>
  </footer>`;
}

export const footerStyles = `
__ROOT__ .site-footer { border-top: 1px solid var(--line); padding: 34px 0 44px; }
__ROOT__ .footer-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
__ROOT__ .site-footer h2 { font: 700 16px/1.2 Arial, sans-serif; letter-spacing: .015em; margin-bottom: 10px; }
__ROOT__ .site-footer p, __ROOT__ .site-footer a, __ROOT__ .site-footer li { font-size: 13px; line-height: 1.55; }
__ROOT__ .site-footer p { margin-bottom: 7px; color: var(--muted); }
__ROOT__ .site-footer .footer-copyright { margin-top: 9px; }
__ROOT__ .site-footer ul { list-style: none; margin: 0; padding: 0; }
__ROOT__ .site-footer li + li { margin-top: 5px; }
__ROOT__ .footer-updates { text-align: center; }
__ROOT__ .site-footer .footer-follow { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; margin-top: 10px; padding: 8px 10px; background: var(--ink); color: var(--paper); text-decoration: none; font-weight: 700; }
__ROOT__ .site-footer .footer-follow:hover { background: var(--forest); }
@media(max-width: 850px) {
  __ROOT__ .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  __ROOT__ .footer-updates { text-align: left; }
  __ROOT__ .site-footer .footer-follow { max-width: 220px; }
}
@media(max-width: 470px) {
  __ROOT__ .footer-grid { grid-template-columns: 1fr; }
  __ROOT__ .site-footer { padding: 26px 0 34px; }
}`;
