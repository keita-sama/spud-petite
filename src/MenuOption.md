# MenuOptions

A menu option is an object that holds key information for creating choices to your select menu.

Template:
```js
{
  label,
  embed,
  description?,
  emoji?,
  default?
}
```

|Option| Type |Default|Optional?|Description|
|:----:|:----:|:-----:|:-------:|:---------:|
|Label |String| null  |         | Label of the option seen in select menu
|Embed|MessageEmbed|null|      | Embed that displays when this option is chosen
|Description |String|null|✅|Description of the option
|Emoji|EmojiResolvable|null|✅|Emoji the option has
|Default|Boolean|false/null|✅|Whether this is the default option
