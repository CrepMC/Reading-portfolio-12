import path from 'node:path';

export const navigation = [
  ['Home', 'index.html'],
  ['First semester', 'First semester/index.html'],
  ['Second semester', 'Second semester/index.html'],
];

export function route(ctx, target, label, attrs = '') {
  if (ctx.embed) {
    const classes = attrs.match(/class="([^"]*)"/)?.[1] || '';
    return `<span class="route-text ${classes}" ${attrs.replace(/class="[^"]*"/, '')}>${label}</span>`;
  }

  const [file, anchor] = target.split('#');
  const relative = path.posix.relative(path.posix.dirname(ctx.path), file);
  const encodedPath = relative.split('/').map(encodeURIComponent).join('/');
  const fragment = anchor ? `#${encodeURIComponent(anchor)}` : '';
  return `<a href="${encodedPath}${fragment}" ${attrs}>${label}</a>`;
}
