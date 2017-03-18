/*\

title: $:/plugins/felixhayashi/session-lock/startup.js
type: application/javascript
module-type: startup

@preserve

\*/

/*** Code **********************************************************/

const handleStartSession = () => {

  window.onbeforeunload = () => false;
  $tw.rootWidget.dispatchEvent({ type: 'tm-browser-refresh' });

};

const handleEndSession = () => {

  // remove any username
  $tm.utils.setField('$:/status/UserName', 'text', '');
  $tw.rootWidget.dispatchEvent({ type: 'tm-save-wiki' });
  $tw.rootWidget.dispatchEvent({ type: 'tm-browser-refresh' });

};

const lockSession = userName => {

  if (!$tw.wiki.getTiddler(userName)) {
    $tw.wiki.addTiddler(new $tw.Tiddler(
      { title: userName, tags: [ 'User' ] },
      $tw.wiki.getCreationFields(),
      $tw.wiki.getModificationFields()
    ));
  }
  // set current user
  $tm.utils.setField('$:/status/UserName', 'text', userName);
  // save wiki
  $tw.rootWidget.dispatchEvent({ type: 'tm-save-wiki' });

};

/**
 * Prevent the user from saving the wiki.
 */
const disableSaving = () => {

  $tw.rootWidget.addEventListener('tm-auto-save-wiki', function() {});
  $tw.rootWidget.addEventListener('tm-save-wiki', function() {});
  // remove any username
  $tm.utils.setField('$:/status/UserName', 'text', '');
  // hide buttons
  const tiddlersToBeHidden = [
    '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/save-wiki',
    '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/new-tiddler',
    '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/save-wiki',
    '$:/config/PageControlButtons/Visibility/$:/core/ui/Buttons/control-panel',
    '$:/config/ViewToolbarButtons/Visibility/$:/core/ui/Buttons/edit',
    '$:/config/ViewToolbarButtons/Visibility/$:/core/ui/Buttons/more-tiddler-actions',
    '$:/config/ViewToolbarButtons/Visibility/$:/plugins/felixhayashi/tiddlymap/misc/quickConnectButton'
  ];

  tiddlersToBeHidden.forEach(tRef => $tm.utils.setField(tRef, 'text', 'hide'));

};

const listeners = {
  'selock:tm-start-session': handleStartSession,
  'selock:tm-end-session': handleEndSession
};

const startup = () => {

  // add handlers to the root widget to make them available from everywhere
  $tm.utils.addTWlisteners(listeners, $tw.rootWidget, this);

  const dialogParams = {
    dialog: {
      buttons: 'ok',
      preselects: { 'mode': 'read' }
    }
  };

  $tm.dialogManager.open('initialDialog', dialogParams, (isConfirmed, outputTObj) => {

    if (outputTObj) {
      const userName = $tm.utils.getField(outputTObj, 'user');
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
exports.platforms = [ 'browser' ];
exports.after = [ 'story', 'tmap.caretaker' ];
exports.synchronous = true;
exports.startup = startup;
