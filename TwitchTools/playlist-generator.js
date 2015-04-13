// ==UserScript==
// @name         Twitch Tools Playlist Generator
// @namespace    http://zegnat.net/
// @version      2.0
// @description  Generate a downloadable playlist to easily load all the different parts of a stream into your media player.
// @author       Martijn van der Ven
// @license      MIT <http://opensource.org/licenses/MIT>
// @match        https://twitchtools.com/video-download
// @grant        none
// @noframes
// ==/UserScript==

(function () {

    "use strict";

    (new MutationObserver(function (mutations) {
        var div = mutations[0].addedNodes[0],
            name = div.getElementsByTagName('h3')[0].innerText.trim().substr(12),
            tables = div.getElementsByTagName('table'),
            tables_length = tables.length,
            i,
            j,
            rows,
            rows_length,
            cell,
            table,
            playlist,
            runningtime;
        for (i = 0; tables_length > i; i += 1) {
            table = tables[i];
            rows = table.rows;
            rows_length = rows.length;

            playlist = "#EXTM3U\n";
            for (j = 0; rows_length > j; j += 1) {
                runningtime = rows[j].cells[2].textContent.trim().match(/(?:(\d+) hours?(?:, )?)?(?:(\d+) minutes?(?:, )?)?(?:(\d+) seconds?)?/);
                runningtime = ((runningtime[1] || 0) * 60 + (runningtime[2] || 0)) * 60 + parseInt(runningtime[3] || 0, 10);
                playlist += '#EXTINF:' + runningtime + ',' + name + ' - Part ' + (j + 1) + "\n";
                playlist += rows[j].getElementsByTagName('a')[0].href.trim() + "\n";
            }

            cell = tables[i].insertRow().insertCell();
            cell.setAttribute('colspan', '4');
            cell.className = 'links';
            cell.innerHTML = '<a download="playlist.m3u" href="data:application/x-mpegurl;base64,' + window.btoa(playlist) + '">Playlist</a>';
        }
    })).observe(document.querySelector('.content'), { childList: true });

}());
