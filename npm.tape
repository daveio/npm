# https://github.com/charmbracelet/vhs
# Don't invoke directly. Use `bun gif`.
# Needs to be able to chdir a directory up.

Output assets/npm.gif

Require bun

Set Shell "fish"
Set FontFamily "VictorMono Nerd Font"
Set FontSize 16
Set Width 850
Set Height 850

Type "bun start" Sleep 500ms  Enter

Sleep 15s
