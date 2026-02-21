/**
 * gene-runner.js — shared WASM loader and Run-button handler for the Gene website.
 *
 * Lazy-loads gene_wasm.js on the first button click, then handles all
 * .gene-run-btn and .gene-clear-btn clicks via event delegation.
 */
(function () {
  'use strict';

  var state = {
    loading: false,
    ready: false,
    loadError: false,
    queue: [], // [{code, cb}]
    geneEval: null,
  };

  function loadWasm() {
    if (state.loading || state.ready || state.loadError) return;
    state.loading = true;

    window.Module = {
      locateFile: function (path) {
        return '/wasm/' + path;
      },
      onRuntimeInitialized: function () {
        state.geneEval = window.Module.cwrap('gene_eval', 'string', ['string']);
        state.ready = true;
        state.loading = false;
        var q = state.queue.slice();
        state.queue = [];
        q.forEach(function (item) { doEval(item.code, item.cb); });
      },
    };

    var script = document.createElement('script');
    script.src = '/wasm/gene_wasm.js';
    script.async = true;
    script.onerror = function () {
      state.loading = false;
      state.loadError = true;
      var q = state.queue.slice();
      state.queue = [];
      q.forEach(function (item) {
        item.cb('Failed to load Gene WASM module. Check that /wasm/gene_wasm.js exists.', true);
      });
    };
    document.body.appendChild(script);
  }

  function doEval(code, cb) {
    try {
      var out = state.geneEval(code);
      cb(out == null ? '' : String(out), false);
    } catch (err) {
      cb(err && err.message ? err.message : String(err), true);
    }
  }

  function runCode(code, cb) {
    if (state.ready) {
      doEval(code, cb);
    } else if (state.loadError) {
      cb('Gene WASM module failed to load. Check the browser console for details.', true);
    } else {
      state.queue.push({ code: code, cb: cb });
      loadWasm();
    }
  }

  // ── Run button ─────────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.gene-run-btn');
    if (!btn) return;

    var runner = btn.closest('.code-runner');
    if (!runner) return;

    var codeEl = runner.querySelector('code');
    var outputPanel = runner.querySelector('.cr-output');
    var outputPre = runner.querySelector('.cr-output-pre');
    if (!codeEl || !outputPanel || !outputPre) return;

    var code = codeEl.textContent;
    btn.disabled = true;
    btn.textContent = '\u27F3 Running\u2026';
    outputPanel.hidden = false;
    outputPre.textContent = '\u2026';
    outputPre.className = 'cr-output-pre';

    runCode(code, function (result, isError) {
      outputPre.textContent = result || (isError ? '(error — no message)' : '(no output)');
      outputPre.className = isError ? 'cr-output-pre error' : 'cr-output-pre';
      btn.disabled = false;
      btn.textContent = '\u25B6 Run';
    });
  });

  // ── Clear button ───────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.gene-clear-btn');
    if (!btn) return;
    var runner = btn.closest('.code-runner');
    if (!runner) return;
    var panel = runner.querySelector('.cr-output');
    if (panel) panel.hidden = true;
  });

  // ── Public API ─────────────────────────────────────────────────────────────
  window.GeneRunner = { run: runCode };
})();
