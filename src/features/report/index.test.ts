import { expect, it, describe, afterEach } from 'vitest';
import mock from 'mock-fs';
import { prismaMock } from '../../../test/setupTests.js';
import { makeReport, scan } from './index.js';

afterEach(() => {
  mock.restore();
});

describe('scan', () => {
  it('should scan components correctly', () => {
    const code = `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        return <Button variant="blue" />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "end": {
                "column": 22,
                "line": 5,
              },
              "start": {
                "column": 16,
                "line": 5,
              },
            },
            "name": "Button",
            "props": {
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should scan components that have a js value as prop', () => {
    const code = `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        const data = {
          test: 'test',
        }
  
        return <Button variant="blue" data={data} />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "end": {
                "column": 22,
                "line": 9,
              },
              "start": {
                "column": 16,
                "line": 9,
              },
            },
            "name": "Button",
            "props": {
              "data": "(Identifier)",
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should set propsSpread to true if the component spreads its props', () => {
    const code = `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        const data = {
          test: 'test',
        }
  
        return <Button variant="blue" {...data} />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "end": {
                "column": 22,
                "line": 9,
              },
              "start": {
                "column": 16,
                "line": 9,
              },
            },
            "name": "Button",
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should get the correct component when spreading the component name', () => {
    const code = `
      import MyLibrary from 'my-library';
  
      const { Button } = MyLibrary;
  
      export const CustomButton = () => {
        const data = {
          test: 'test',
        }
  
        return <Button variant="blue" {...data} />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "location": {
              "end": {
                "column": 22,
                "line": 11,
              },
              "start": {
                "column": 16,
                "line": 11,
              },
            },
            "name": "Button",
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should only include jsx component imports in the report', () => {
    const code = `
      import MyLibrary from 'my-library';
      import { bla } from '../bla';
      import Bla from 'bla';
  
      const { Button } = MyLibrary;
  
      export const CustomButton = () => {
        const data = {
          test: 'test',
        }
  
        return <Button variant="blue" {...data} />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "location": {
              "end": {
                "column": 22,
                "line": 13,
              },
              "start": {
                "column": 16,
                "line": 13,
              },
            },
            "name": "Button",
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should parse literal values from JSXExpressionContainers', () => {
    const code = `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        const name = 'world';
  
        return <Button variant="blue"  text={"name"} />;
      } 
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "end": {
                "column": 22,
                "line": 7,
              },
              "start": {
                "column": 16,
                "line": 7,
              },
            },
            "name": "Button",
            "props": {
              "text": "name",
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should desctructure the name of the component if it was used with dot syntax', () => {
    const code = `
      import MyLibrary from 'my-library';
      import { bla } from '../bla';
      import Bla from 'bla';
  
      export const CustomButton = () => {
        const data = {
          test: 'test',
        }
  
        return <MyLibrary.Button variant="blue" {...data} />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "importInfo": {
              "importType": "ImportDefaultSpecifier",
              "local": "MyLibrary",
              "moduleName": "my-library",
            },
            "location": {
              "end": {
                "column": 32,
                "line": 11,
              },
              "start": {
                "column": 16,
                "line": 11,
              },
            },
            "name": "MyLibrary.Button",
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should scan jsx member expressions', () => {
    const code = `
      export const CustomButton = ({ as }) => {
        const As = as || 'div'
  
        return <As variant="blue" {...data} />;
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "location": {
              "end": {
                "column": 18,
                "line": 5,
              },
              "start": {
                "column": 16,
                "line": 5,
              },
            },
            "name": "As",
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });

  it('should scan jsx namespaced name', () => {
    const code = `
      import * as mynamespace from 'my-namespace';
  
      export const CustomButton = ({ as }) => {
        return <mynamespace:Menu variant="blue" />
      }
    `;

    const ast = scan({ code, filePath: 'src/test/Component.tsx' });

    expect(ast).toMatchInlineSnapshot(`
      {
        "components": [
          {
            "importInfo": {
              "importType": "ImportNamespaceSpecifier",
              "local": "mynamespace",
              "moduleName": "my-namespace",
            },
            "location": {
              "end": {
                "column": 32,
                "line": 5,
              },
              "start": {
                "column": 16,
                "line": 5,
              },
            },
            "name": "mynamespace.Menu",
            "props": {
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
        "filePath": "src/test/Component.tsx",
      }
    `);
  });
});

describe('report', () => {
  it('should read a file and return the report for the file', async () => {
    const code = `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        return (
          <>
            <Button variant="blue" />
            <Button variant="yellow" />
          </>
          );
      }
    `;

    mock({
      'Component.tsx': code,
    });

    const report = await makeReport(['Component.tsx']);

    expect(report).toMatchInlineSnapshot(`
      [
        {
          "components": [
            {
              "importInfo": {
                "importType": "ImportSpecifier",
                "imported": "Button",
                "local": "Button",
                "moduleName": "my-library",
              },
              "location": {
                "end": {
                  "column": 19,
                  "line": 7,
                },
                "start": {
                  "column": 13,
                  "line": 7,
                },
              },
              "name": "Button",
              "props": {
                "variant": "blue",
              },
              "propsSpread": false,
            },
            {
              "importInfo": {
                "importType": "ImportSpecifier",
                "imported": "Button",
                "local": "Button",
                "moduleName": "my-library",
              },
              "location": {
                "end": {
                  "column": 19,
                  "line": 8,
                },
                "start": {
                  "column": 13,
                  "line": 8,
                },
              },
              "name": "Button",
              "props": {
                "variant": "yellow",
              },
              "propsSpread": false,
            },
          ],
          "filePath": "Component.tsx",
        },
      ]
    `);
  });

  it('should make requests to db', async () => {
    const code = `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        return (
          <>
            <Button variant="blue" />
            <Button variant="yellow" />
          </>
          );
      }
    `;

    mock({
      'Component.tsx': code,
    });

    await makeReport(['Component.tsx']);

    expect(prismaMock.file.create.mock.calls[0][0]).toMatchInlineSnapshot(
      `
      {
        "data": {
          "components": {
            "create": [
              {
                "importType": "ImportSpecifier",
                "imported": "Button",
                "local": "Button",
                "locationEndColumn": 19,
                "locationEndLine": 7,
                "locationStartColumn": 13,
                "locationStartLine": 7,
                "moduleName": "my-library",
                "name": "Button",
                "propsSpread": false,
              },
              {
                "importType": "ImportSpecifier",
                "imported": "Button",
                "local": "Button",
                "locationEndColumn": 19,
                "locationEndLine": 8,
                "locationStartColumn": 13,
                "locationStartLine": 8,
                "moduleName": "my-library",
                "name": "Button",
                "propsSpread": false,
              },
            ],
          },
          "path": "Component.tsx",
        },
      }
    `
    );
  });
});
