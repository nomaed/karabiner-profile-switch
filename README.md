# karabiner-profile-switch
A simple CLI tool to switch between Karabiner-Elements profiles in the JSON configuration file


This is a temporary solution for [Karabiner Elements](https://github.com/tekezo/Karabiner-Elements) for macOS Sierra.

Currently configuration changes are made in a JSON file, and to make things easier this tool will set
the `selected` profile in the JSON file. This eliminates the need to edit the JSON file manually when disconnecting 
or reconneting input devices that require different configuration.

**TODO**: Auto-restart Karabiner-Elemenets.
