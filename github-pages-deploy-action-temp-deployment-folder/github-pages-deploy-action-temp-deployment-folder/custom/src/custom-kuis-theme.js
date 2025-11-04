/**
 * Copyright 2025 andyprodistik
 * @license Apache-2.0, see License.md for full text.
 */
import { HAXCMSLitElementTheme, css, unsafeCSS, html, store, autorun, toJS } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";

/**
 * `CustomKuisTheme`
 * `CustomKuisTheme based on HAXCMS theming ecosystem`
 * `This theme is an example of extending an existing theme component`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSLitElementTheme - A class that provides correct baseline wiring to build a new theme that HAX can use
 *
 * @documentation - see HAX docs to learn more about theming
 *  - Custom theme development - https://haxtheweb.org/documentation/developers/haxsite/custom-theme-development
 *  - Theme Blocks - https://haxtheweb.org/documentation/developers/theme-blocks
 *  - DDD - https://haxtheweb.org/documentation/ddd
 *  - Data Store - https://haxtheweb.org/documentation/developers/haxsite/data-store
 * @element custom-kuis-theme
 */
class CustomKuisTheme extends HAXCMSLitElementTheme {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "custom-kuis-theme";
  }

  // set defaults or tie into the store
  constructor() {
    super();
    this._items = [];
    this.activeId = null;
    this.logo = null;
    autorun(() => {
      this.activeId = toJS(store.activeId);
      this._items = toJS(store.manifest.items);
      this.logo = toJS(store.manifest?.metadata?.site?.logo) || null;
    });
  }

  toggleDarkMode = (e) => {
    e?.preventDefault?.();
    document.body.classList.toggle('dark-mode');
    this.requestUpdate();
  }

  // properties to respond to the activeID and list of items
  static get properties() {
    return {
      ...super.properties,
      activeId: { type: String },
      _items: { type: Array },
      logo: { type: String },
    };
  }

  // allows for global styles to be set against the entire document
  // you can also use this to cascade styles down to the theme
  // but the more common reason is to influence the body or other things
  // put into the global index.html context by the system itself
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
      :root {
        --my-theme-low-tone: var(--ddd-theme-default-slateMaxLight);
        --my-theme-high-tone: var(--ddd-theme-default-coalyGray);
      }
      body {
        padding: var(--ddd-spacing-0);
        margin: var(--ddd-spacing-0);
        background-color: var(--my-theme-low-tone);
      }
      body.dark-mode {
        background-color: var(--my-theme-high-tone);
      }
      `,
    ];
  }

  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-10) var(--ddd-spacing-20);
          max-width: 1200px;
          min-width: 320px;
          margin: var(--ddd-spacing-0) auto;
          border: var(--ddd-border-lg);
          border-width: var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-lg);
          background-color: light-dark(var(--my-theme-low-tone), var(--my-theme-high-tone));
          color: light-dark(var(--my-theme-high-tone), var(--my-theme-low-tone));
        }
        .wrapper {
          border-radius: var(--ddd-radius-lg);
        }

        /* Modern site header */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          border-radius: calc(var(--ddd-radius-lg) - var(--ddd-spacing-2));
          background:
            linear-gradient(
              180deg,
              light-dark(
                color-mix(in oklab, var(--my-theme-low-tone) 92%, transparent),
                color-mix(in oklab, var(--my-theme-high-tone) 92%, transparent)
              ),
              light-dark(
                color-mix(in oklab, var(--my-theme-low-tone) 86%, transparent),
                color-mix(in oklab, var(--my-theme-high-tone) 86%, transparent)
              )
            );
          backdrop-filter: blur(8px);
          box-shadow: 0 6px 24px rgba(0,0,0,.08), inset 0 0 0 1px rgba(255,255,255,.05);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          min-width: 0;
        }
        .brand site-title {
          font-size: var(--ddd-font-size-xl);
          font-weight: 700;
          letter-spacing: .2px;
          white-space: nowrap;
        }
        .logo {
          height: 32px;
          width: auto;
          inline-size: auto;
          block-size: 32px;
          border-radius: 6px;
          object-fit: cover;
          box-shadow: 0 1px 2px rgba(0,0,0,.12);
        }
        .nav-scroll {
          flex: 1 1 auto;
          min-width: 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: color-mix(in oklab, currentColor 40%, transparent) transparent;
        }
        .chips {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .chips ul { 
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: 0; padding: 0;
          list-style: none;
        }
        .chips li { display: inline-flex; }
        .chip-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 34px;
          min-width: 34px;
          padding: 0 var(--ddd-spacing-3);
          border-radius: 999px;
          border: 1px solid color-mix(in oklab, currentColor 20%, transparent);
          background: transparent;
          color: currentColor;
          font-size: var(--ddd-font-size-sm);
          line-height: 1;
          transition: background .2s ease, color .2s ease, border-color .2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .chip-btn:hover {
          background: color-mix(in oklab, currentColor 8%, transparent);
        }
        .active .chip-btn {
          background: light-dark(var(--my-theme-low-tone), var(--my-theme-high-tone));
          color: light-dark(var(--my-theme-high-tone), var(--my-theme-low-tone));
          border-color: transparent;
          font-weight: 700;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .icon-btn {
          height: 36px;
          width: 36px;
          display: inline-grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid color-mix(in oklab, currentColor 20%, transparent);
          background: transparent;
          color: currentColor;
          cursor: pointer;
        }
        .icon-btn:hover {
          background: color-mix(in oklab, currentColor 8%, transparent);
        }
        site-menu-button {
          display: inline-block;
          vertical-align: middle;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        <header class="site-header">
          <div class="brand">
            <site-menu-button type="prev" position="top"></site-menu-button>
            ${this.logo ? html`<img class="logo" src="${this.logo}" alt="Logo" />` : ''}
            <site-title></site-title>
          </div>
          <div class="nav-scroll">
            <nav class="chips" aria-label="Halaman">
              <ul>
                ${this._items.map((item, index) => html`
                  <li class="${item.id === this.activeId ? 'active' : ''}">
                    <a class="chip-btn" href="${item.slug}" title="${item.title}">${index + 1}</a>
                  </li>
                `)}
              </ul>
            </nav>
          </div>
          <div class="actions">
            <button class="icon-btn" title="Toggle mode" @click="${this.toggleDarkMode}" aria-label="Ubah mode">
              ${document?.body?.classList?.contains('dark-mode') ? '☀' : '🌙'}
            </button>
            <site-menu-button type="next" position="top"></site-menu-button>
          </div>
        </header>
        <main>
          <site-active-title></site-active-title>
          <article>
            <!-- this block and names are required for HAX to edit the content of the page. contentcontainer, slot, and wrapping the slot. -->
            <div id="contentcontainer"><div id="slot"><slot></slot></div></div>
          </article>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    `;
  }

}
globalThis.customElements.define(CustomKuisTheme.tag, CustomKuisTheme);
export { CustomKuisTheme };
