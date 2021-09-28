// ==UserScript==
// @name         MudBlazor documentation order
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Meaningful grouping and ordering of the MudBlazor documentation menu.
//                * Works on https://mudblazor.com/ and https://mudblazor.com/wasm/
//                * If the script doesn't work, then refresh the web page (F5) or increase time in the setTimeout() function e.g. to 2000 ms.
//                * If new components are added to MudBlazor, then they will be listed at the end of menu. Add them to the menuOrder table to move them.
//                * Items in the menuOrder table that aren't in the menu are logged by console.log().
//                * If you want to insert a divider in the menu then add '!DIVIDER' element to the table.
//                * Submenus are sorted separately, but their items can be put in the menuOrder table together with other menu items.
//               The script also decreases vertical margins of menu items.
// @author       https://github.com/iwis
// @match        https://mudblazor.com/*
// @match        https://dev.mudblazor.com/*
// @icon         https://www.google.com/s2/favicons?domain=mudblazor.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const menuOrder = [
        /* --- Containers --- */
        'AppBar', 'Drawer', 'Nav Menu',
        'Container',
        'Breadcrumbs',
        'ToolBar',
        'Grid',
        'Tabs', 'Expansion Panels',
        'Timeline',
        'Paper', 'Card',
        'TreeView',
        'List',
        'Simple Table', 'Table',
        'Pagination',
        'Carousel',
        'Message Box', 'Dialog',
        'Divider',

        /* --- Non-containers --- */ '!DIVIDER',
        'Alert', 'Snackbar',
        'Tooltip', 'Popover',
        'Badge',
        'Chips', 'ChipSet',
        'Icons', 'Avatar', 'Charts',
        'Link', 'Buttons', 'Menu', 'File Upload',
        'Form Inputs & controls', 'Pickers', 'Rating',
        'Typography', 'Highlighter',

        /* ---- Utilities ---- */ '!DIVIDER',
        'Skeleton',
        'Progress',
        'Overlay',
        'Hidden',
        'SwipeArea',
        'ScrollToTop',
        'Focus Trap',
        'Element',

        /* --- The order in the "Charts" submenu --- */
        'Line chart', 'Bar chart', 'Pie chart', 'Donut chart',

        /* --- The order in the "Buttons" submenu --- */
        'Button', 'Button FAB', 'IconButton', 'ToggleIconButton', 'Button Group',

        /* --- The order in the "Form Inputs & controls" submenu --- */
        'Text Field',
        'Numeric Field', 'Slider',
        'Checkbox', 'Radio', 'Switch',
        'Select', 'Autocomplete',
        'Field',
        'Form',

        /* --- The order in the "Charts" submenu --- */
        'Date Picker', 'Time Picker', 'Color Picker'
    ];

    /* eslint curly: "off" */

    // Otherwise the script sometimes runs twice (e.g. on the https://mudblazor.com/components/appbar page)
    // See https://stackoverflow.com/questions/5876874/why-does-jquery-load-twice-in-my-greasemonkey-script
    if (window.top != window.self) return;

    setTimeout(() => {
        sortMenu();
        changeCSS();
    }, 1500); // todo: Waiting for the load event doesn't work. Why? Sometimes even 1500ms isn't enough in Blazor Server.

    let menu = null; // stored here because it is also needed for !DIVIDER

    function sortMenu() {
        for (let i = menuOrder.length - 1; i >= 0; i--) {
            // only the first one, so in the "Components" submenu, not in the "API" submenu
            const menuElement = document.evaluate("//*[@class='mud-nav-link-text' and text()='"+menuOrder[i]+"']/../..",
                                                  document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (menuElement !== null) { // we have found such item in the menu
                menu = menuElement.parentNode;
                menu.prepend(menuElement); // add it at the beginning of the menu (so it is the reordering step)
            }
            else if (menuOrder[i] === '!DIVIDER')
                menu.insertAdjacentHTML('afterbegin', '<hr class="mud-divider" style="margin-left: 45px; margin-right: 15px">');
            else
                console.log('Cannot find menu item "' + menuOrder[i] + '". Update the menuOrder table in the script.');
        }
    }

    function changeCSS() {
        let style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule('.mud-nav-link { padding-top: 6px !important; padding-bottom: 6px !important; }');
    }
})();