TW5-SessionLock
=====================================================================

Provides a very basic user session mechanism.

### Dependencies

* [TiddlyMap](https://github.com/felixhayashi/TW5-TiddlyMap) and all plugins required by TiddlyMap!
* [TiddlyFox](https://addons.mozilla.org/en-Us/firefox/addon/tiddlyfox/) to autosave the wiki
* The wiki needs to be stored on a network drive or on a filesystem with sufficient access rights (rw).

### Demo:

https://felixhayashi.github.io/TW5-SessionLock/

### How it works

* When opening a wiki, users are asked whether to open it in read or write mode. The dialog also displays the information whether the wiki is currently used in write mode and who is editing the wiki at the moment.
  * If the user chooses to open the wiki in write mode, he/she is asked to enter his/her name, which can be also selected from a list of existing names.
     * Non-existent users are newly added to the wiki (tagged "User").
     * The wiki is then immediately (and automatically) saved so anybody opening the wiki is informed that it is in use (a red bar at the top).
     * All tiddlers created are signed with the user name as author
  * In read mode opened
     * all edit/config buttons are removed and the wiki cannot be saved or auto-saved
     * The user has the option to switch into write mode, which will cause the wiki to reload and to display the initial dialog again (see first point)

### FAQ

* Why does this plugin depend to TiddlyMap?
  Because it requires the utils and the dialog system provided by TiddlyMap.
