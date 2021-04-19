const {testFixture} = require('../../fixture-utils');
const dedent = require('dedent');

describe('cssModules', () => {
  beforeAll(() => {
    // Needed until we make Snowpack's JS Build Interface quiet by default
    require('snowpack').logger.level = 'error';
  });

  it('Generates CSS Modules from .module.css files', async () => {
    const result = await testFixture({
      'public/index.html': dedent`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
          </head>
          <body>
            <div id="app"></div>
            <script src="/_dist/App.js" type="module"></script>
          </body>
        </html>
      `,
      'src/App.jsx': dedent`
        import React from 'react';
        import ReactDOM from 'react-dom';

        import Styles from './App.module.css';

        function App() {
          return (
            <div className={Styles.App}>
              <header className={Styles['App-header']}>
                <img src={logo} className={Styles['App-logo']} alt="logo" />
                <p>
                  Edit <code>src/App.jsx</code> and save to reload.
                </p>
                <p>
                  Page has been open for <code>{count}</code> seconds.
                </p>
                <p>
                  <a
                    className={Styles['App-link']}
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn React
                  </a>
                </p>
              </header>
            </div>
          );
        }

        ReactDOM.render(<App />, document.getElementById('app'));
      `,
      'src/App.module.css': dedent`
        .App {
          text-align: center;
        }
        .App code {
          background: #FFF3;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .App p {
          margin: 0.4rem;
        }
        .App-logo {
          height: 40vmin;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: no-preference) {
          .App-logo {
            animation: App-logo-spin infinite 20s linear;
          }
        }

        .App-header {
          background-color: #282c34;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: calc(10px + 2vmin);
          color: white;
        }

        .App-link {
          color: #61dafb;
        }

        @keyframes App-logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `,
      'snowpack.config.js': dedent`
        module.exports = {
          mount: {
            src: '/_dist_',
            public: '/'
          },
        };
      `,
    });

    expect(result['_dist_/App.module.css.proxy.js']).toMatch(/\._App_[A-Za-z0-9]+_[A-Za-z0-9]+ \{/);
    expect(result['_dist_/App.module.css.proxy.js']).toContain(`let json = {"App":"_App_`);
    expect(result['_dist_/App.module.css']).not.toContain(`.App {`);
    expect(result['_dist_/App.module.css.json']).toBeDefined();
  });
});