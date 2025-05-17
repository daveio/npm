# https://github.com/charmbracelet/vhs
# Don't invoke directly. Use `bun gif`.
# Needs to be able to chdir a directory up.

Output npm/assets/npm.gif

Require bun

Set Shell "fish"
Set FontFamily "VictorMono Nerd Font"
Set FontSize 16
Set Width 1200
Set Height 780

Type "npx dave.io" Sleep 500ms  Enter

Sleep 15s
