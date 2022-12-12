import { expect, it } from 'vitest';
import { scan } from '.';

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
      "Button": {
        "instances": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 5,
              },
            },
            "props": {
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
      },
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
      "Button": {
        "instances": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 9,
              },
            },
            "props": {
              "data": "(Identifier)",
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
      },
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
      "Button": {
        "instances": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 9,
              },
            },
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
      },
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
      "Button": {
        "instances": [
          {
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 11,
              },
            },
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
      },
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
      "Button": {
        "instances": [
          {
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 13,
              },
            },
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
      },
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
      "Button": {
        "instances": [
          {
            "importInfo": {
              "importType": "ImportSpecifier",
              "imported": "Button",
              "local": "Button",
              "moduleName": "my-library",
            },
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 7,
              },
            },
            "props": {
              "text": "name",
              "variant": "blue",
            },
            "propsSpread": false,
          },
        ],
      },
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
      "MyLibrary": {
        "components": {
          "Button": {
            "instances": [
              {
                "importInfo": {
                  "importType": "ImportDefaultSpecifier",
                  "local": "MyLibrary",
                  "moduleName": "my-library",
                },
                "location": {
                  "file": "src/test/Component.tsx",
                  "start": {
                    "column": 14,
                    "line": 11,
                  },
                },
                "props": {
                  "variant": "blue",
                },
                "propsSpread": true,
              },
            ],
          },
        },
      },
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
      "As": {
        "instances": [
          {
            "location": {
              "file": "src/test/Component.tsx",
              "start": {
                "column": 14,
                "line": 5,
              },
            },
            "props": {
              "variant": "blue",
            },
            "propsSpread": true,
          },
        ],
      },
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
      "mynamespace": {
        "components": {
          "Menu": {
            "instances": [
              {
                "importInfo": {
                  "importType": "ImportNamespaceSpecifier",
                  "local": "mynamespace",
                  "moduleName": "my-namespace",
                },
                "location": {
                  "file": "src/test/Component.tsx",
                  "start": {
                    "column": 14,
                    "line": 5,
                  },
                },
                "props": {
                  "variant": "blue",
                },
                "propsSpread": false,
              },
            ],
          },
        },
      },
    }
  `);
});
