/* SEA-SpeechBench — project page */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- Tabs -- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[role=tab]"));

  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });

  /* ------------------------------------------------------- Sortable tables -- */

  /* Map every header cell to the column it starts at, honouring rowspan and
     colspan so the two-row headers resolve correctly. */
  function headerMap(table) {
    var rows = table.tHead ? table.tHead.rows : [];
    var grid = [];
    var out = [];

    for (var r = 0; r < rows.length; r++) {
      var c = 0;
      for (var i = 0; i < rows[r].cells.length; i++) {
        var cell = rows[r].cells[i];
        grid[r] = grid[r] || [];
        while (grid[r][c]) c++;

        var cs = cell.colSpan || 1;
        var rs = cell.rowSpan || 1;
        for (var dr = 0; dr < rs; dr++) {
          grid[r + dr] = grid[r + dr] || [];
          for (var dc = 0; dc < cs; dc++) grid[r + dr][c + dc] = cell;
        }

        out.push({ cell: cell, col: c, span: cs });
        c += cs;
      }
    }
    return out;
  }

  /* "2B" / "5.6B" -> 5.6 ; "12,345" -> 12345 ; "—" -> null (always sorts last) */
  function numeric(text) {
    if (!text) return null;
    var t = text.replace(/,/g, "").replace(/[−–—]/g, "-").trim();
    if (t === "" || t === "-") return null;
    var m = t.match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function setup(table) {
    var tbody = table.tBodies[0];
    if (!tbody) return;

    var rows = Array.prototype.slice.call(tbody.rows);
    rows.forEach(function (row, i) { row._home = i; });

    var map = headerMap(table);
    var tableBetter = table.getAttribute("data-better");

    /* A column's "better" direction: its own hint, else the group header
       spanning it, else the table default. Used so the first click ranks
       best-first rather than arbitrarily. */
    function betterFor(col) {
      for (var i = 0; i < map.length; i++) {
        var e = map[i];
        var hint = e.cell.getAttribute("data-better");
        if (hint && col >= e.col && col < e.col + e.span) return hint;
      }
      return tableBetter;
    }

    map.forEach(function (entry) {
      if (entry.span > 1) return;               // group headers are not sortable
      var th = entry.cell;
      var col = entry.col;
      var isText = th.classList.contains("l");

      th.classList.add("sortable");
      th.tabIndex = 0;
      th.setAttribute("aria-sort", "none");
      th.title = "Sort by " + (th.textContent.trim() || "column");

      function apply() {
        var state = th.getAttribute("aria-sort");
        var first = isText ? "ascending"
                  : betterFor(col) === "lo" ? "ascending" : "descending";
        var next = state === "none" ? first
                 : state === first ? (first === "ascending" ? "descending" : "ascending")
                 : "none";                       // third click restores source order

        map.forEach(function (e) {
          if (e.span === 1) e.cell.setAttribute("aria-sort", "none");
        });
        th.setAttribute("aria-sort", next);

        var sorted = rows.slice();
        if (next === "none") {
          sorted.sort(function (a, b) { return a._home - b._home; });
        } else {
          var sign = next === "ascending" ? 1 : -1;
          sorted.sort(function (a, b) {
            var ta = (a.cells[col] || {}).textContent || "";
            var tb = (b.cells[col] || {}).textContent || "";
            var cmp;
            if (isText) {
              cmp = ta.trim().toLowerCase().localeCompare(tb.trim().toLowerCase());
            } else {
              var na = numeric(ta), nb = numeric(tb);
              if (na === null && nb === null) cmp = 0;
              else if (na === null) return 1;    // blanks sink, either direction
              else if (nb === null) return -1;
              else cmp = na - nb;
            }
            return cmp !== 0 ? cmp * sign : a._home - b._home;
          });
        }

        sorted.forEach(function (r) { tbody.appendChild(r); });
        /* The open/commercial rule only means something in source order. */
        tbody.classList.toggle("is-sorted", next !== "none");
      }

      th.addEventListener("click", apply);
      th.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apply(); }
      });
    });
  }

  Array.prototype.slice.call(document.querySelectorAll(".panel table")).forEach(setup);

  /* ------------------------------------------------------------ Citation -- */

  var btn = document.getElementById("copy");
  var bib = document.getElementById("bibtex");

  if (btn && bib) {
    btn.addEventListener("click", function () {
      var text = bib.textContent;
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  }
})();
