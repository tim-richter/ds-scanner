import mock from 'mock-fs';
import { afterEach, expect, it } from 'vitest';
import { scanBase } from './scanBase.js';

afterEach(() => {
  mock.restore();
});

it('should work', () => {
  mock({
    '/mock/index.tsx': `
      const Button = () => <div>Button</div>;
      const Text = () => <div>Text</div>;
  
      export { Button, Text };
      export * from './components';
    `,
    '/mock/components': {
      'index.ts': `
        export { Accordion, Paragraph };
      `,
    },
  });

  const result = scanBase('/mock/index.tsx', '/mock');
  expect(result).toMatchInlineSnapshot(`
    [
      "Button",
      "Text",
      "Accordion",
      "Paragraph",
    ]
  `);
});
