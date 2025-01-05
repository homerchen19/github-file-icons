#!/usr/bin/env node
'use strict';
/**
 * @fileoverview Script to launch a clean Chrome instance on-demand.
 *
 * Assuming Lighthouse is installed globally or `npm link`ed, use via:
 *     chrome-debug
 * Optionally enable extensions or pass a port, additional chrome flags, and/or a URL
 *     chrome-debug --port=9222
 *     chrome-debug http://goat.com
 *     chrome-debug --show-paint-rects
 *     chrome-debug --enable-extensions
 */
require('./compiled-check.js')('./dist/chrome-launcher.js');
const { launch } = require('./dist/chrome-launcher');
const args = process.argv.slice(2);
let chromeFlags;
let startingUrl;
let port;
let enableExtensions;
if (args.length) {
    chromeFlags = args.filter(flag => flag.startsWith('--'));
    const portFlag = chromeFlags.find(flag => flag.startsWith('--port='));
    port = portFlag && portFlag.replace('--port=', '');
    enableExtensions = !!chromeFlags.find(flag => flag === '--enable-extensions');
    startingUrl = args.find(flag => !flag.startsWith('--'));
}
launch({
    startingUrl,
    port,
    enableExtensions,
    chromeFlags,
}).then(v => console.log(`✨  Chrome debugging port: ${v.port}`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFudWFsLWNocm9tZS1sYXVuY2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21hbnVhbC1jaHJvbWUtbGF1bmNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLFlBQVksQ0FBQztBQUNiOzs7Ozs7Ozs7O0dBVUc7QUFFSCxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzVELE1BQU0sRUFBQyxNQUFNLEVBQUMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUVuRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxJQUFJLFdBQVcsQ0FBQztBQUNoQixJQUFJLFdBQVcsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQztBQUNULElBQUksZ0JBQWdCLENBQUM7QUFFckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEIsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFekQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN0RSxJQUFJLEdBQUcsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRW5ELGdCQUFnQixHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLENBQUM7SUFFOUUsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxDQUFDO0lBQ0wsV0FBVztJQUNYLElBQUk7SUFDSixnQkFBZ0I7SUFDaEIsV0FBVztDQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDIn0=