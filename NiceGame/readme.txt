--------------------------------------------------------------------------------

		    - Yume Nikki Fangame Template Project -
							
--------------------------------------------------------------------------------

Author: Clockwork Prince 
-------	http://clockworkprince.itch.io
	https://rpgmaker.net/users/ClockworkPrince/

				    --------

Please feel free to redistribute this project template free of charge. 
Translations are free to be distributed as well. 

If you want to monetize work based on this project template, please do so 
on via optional donations (e.g. PayPal, Patreon, etc.) that aren't required to
access the download. 
	
				    --------

/!\ WARNING /!\
---------------

It is adviced to not remove or edit pre-existing Common Events without 
understanding what they do and how they are used. A lot of this template
project makes use of Common Events to recycle simple commands for ease of 
editing what would otherwise be several incarnations of the same file 
dependencies or batches of event commands. 
	
				    --------

Template Project contents:
--------------------------

* Basic map structure with some common YNFG maps: 
  - Real bedroom
  - Dream bedroom
  - Nexus
  - Dream World containing an Effect giving NPC (for sample purposes)

* A debug room that contains:
  - Effect-giving events
  - A generic template neutral NPC that...
    ...runs away when the "Weapon" Effect is equipped; dies when attacked.
    ...ignores the player when the "Invisible" Effect is equipped and active.
    ...stops moving when the "Stop NPCs" Effect is equipped and active.
    ...slides towards the player when the "Attract NPCs" Effect is equipped and
       Shift is pressed. 
  - A generic template chaser NPC that...
    ...does all the aforementioned generic template neutral NPC does. 
    ...changes sprite and becomes hostile when hit with the "Weapon" Effect.
    ...teleports the player elsewhere when interacted with in hostile form 
       rather than dying like the neutral NPC would. 
  - A "seat" formed out of open chests to demonstrate the seat functionality.
  - Stairs to demonstrate the use of diagonal stairs. 
  - Dimmed light to test the Light Effect.
  - A locked door with bars that only the Tiny (and Debug) Effect can fit 
    through. 
  - A teleportation event to the demonstration map "Dream World 1".

* 24 Effects (+ 1 Debug Effect), including functionality based on Yume Nikki's 
  existing Effects. 
  The Effects with functionality that have been implemented are: 
  - Fast Speed (based on Bicycle)
  - Slow Speed (based on Severed Head)
  - Swim Fast (based on Frog)
  - Weapon (based on Knife / Kitchen Knife)
  - Nexus Teleport (based on Medamaude / Eye Palm)
  - Invisible (based on Triangle Kerchief / Spirit Headband)
  - Stop NPCs (based on Stoplight / Traffic Light)
  - Attract NPCs (based on Cat)
  - Rain (based on Umbrella)
  - Snow (based on Yuki Onna / Snow Woman)
  - Light (based on Lamp)
  - Tiny (based on Midget)
  - Debug (no Yume Nikki equivalent)
  NOTE: The Debug Effect is multi-functional and mainly meant for testing 
        purposes.

* Common Events for several things: 
  - Debug menu for playtesting
  - Effect equipping, dequipping and obtaining
  - Reading player button input
  - Disabling/Enabling menu accessibility
  - Diagonal stairs
  - Tracking the player's location
  - Save game handling
  - Sitting down on and getting up from seats like benches, sofas, chairs, etc.
  - Setting the player's speed
  - Setting the player's sprite back to the walking sprite
  - Commonly played SEs with their preferred pitch and volume level
  - Game version check that warns the player if they load a save file from a 
    different game version.
  - Events that teleport the player to the intended starting map when the game 
    is not launched in Playtest Mode. 
    NOTE: This mode is usually only activated when you launch your game through
          RPG Maker 2003 rather than RPG_RT.exe.

				    --------

Quickstart guide: 
-----------------

To make Effects work properly, edit the following for each of them: 

* Items: 
  ------
	2 in total; 1 usable dream version, 1 unusable real world one
	You only need to edit the name and description for these.

* Common Events: 
  --------------
	4 in total; 1 Equip common event, "Shift Actions", "Wake Up", 
	"Set Default Sprite".
	You need to edit the character walk sprite, faceset, event the 
        animations used for waking up and performing actions, player
        character nickname (if so desired) and any special Effect
	functionality that hasn't been implemented (such as the screen 
        tinting that the Neon Effect does or functionality that only
	exists in fangames).

* Maps: 
  -----
	- In-game Effect location(s) and the Map Event(s) that give it.
	- Debug Room: Edit so it contains an accurate reflection of the
          edited Effect. (Optional, but advised.)

