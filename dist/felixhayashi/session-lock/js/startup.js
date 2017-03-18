'use strict';

/*\

title: $:/plugins/felixhayashi/session-lock/startup.js
type: application/javascript
module-type: startup

@preserve

\*/

/*** Code **********************************************************/

var handleStartSession = function handleStartSession() {

  window.onbeforeunload = function () {
    return false;
  };
  $tw.rootWidget.dispatchEvent({ type: 'tm-browser-refresh' });
};

var handleEndSession = function handleEndSession() {

  // remove any username
  $tm.utils.setField('$:/status/UserName', 'text', '');
  $tw.rootWidget.dispatchEvent({ type: 'tm-save-wiki' });
  $tw.rootWidget.dispatchEvent({ type: 'tm-browser-refresh' });
};

var lockSession = function lockSession(userName) {

  if (!$tw.wiki.getTiddler(userName)) {
    $tw.wiki.addTiddler(new $tw.Tiddler({ title: userName, tags: ['User'] }, $tw.wiki.getCreationFields(), $tw.wiki.getModificationFields()));
  }
  // set current user
  $tm.utils.setField('$:/status/UserName', 'text', userName);
  // save wiki
  $tw.rootWidget.dispatchEvent({ type: 'tm-save-wiki' });
};

/**
 * Prevent the user from saving the wiki.
 */
var disableSaving = function disableSaving() {

  $tw.rootWidget.addEventListener('tm-auto-save-wiki', function () {});
  $tw.rootWidget.addEventListener('tm-save-wiki', function () {});
  // remove any username
  $tm.utils.setField('$:/status/UserName', 'text', '');
  // hide buttons
  var tiddlersToBeHidden = ['$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/save-wiki', '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/new-tiddler', '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/save-wiki', '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/control-panel', '$:/config/ViewToolbarButtons/Visibility/$:/core/ui/Buttons/edit', '$:/config/ViewToolbarButtons/Visibility/$:/core/ui/Buttons/more-tiddler-actions', '$:/config/ViewToolbarButtons/Visibility/$:/plugins/felixhayashi/tiddlymap/misc/quickConnectButton'];

  tiddlersToBeHidden.forEach(function (tRef) {
    return $tm.utils.setField(tRef, 'text', 'hide');
  });
};

var listeners = {
  'selock:tm-start-session': handleStartSession,
  'selock:tm-end-session': handleEndSession
};

var startup = function startup() {

  // add handlers to the root widget to make them available from everywhere
  $tm.utils.addTWlisteners(listeners, $tw.rootWidget, undefined);

  var dialogParams = {
    dialog: {
      buttons: 'ok',
      preselects: { 'mode': 'read' }
    }
  };

  $tm.dialogManager.open('initialDialog', dialogParams, function (isConfirmed, outputTObj) {

    if (outputTObj) {
      var userName = $tm.utils.getField(outputTObj, 'user');
      if (userName) {
        lockSession(userName);
        return;
      }
    }

    disableSaving();
  });
};

/*** Exports *******************************************************/

exports.name = 'sessionlock';
exports.platforms = ['browser'];
exports.after = ['story', 'tmap.caretaker'];
exports.synchronous = true;
exports.startup = startup;
//# sourceMappingURL=./maps/felixhayashi/session-lock/js/startup.js.map
