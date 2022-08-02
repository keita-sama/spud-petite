## spud-petite

A petite version of [spud.js](https://www.npmjs.com/package/spud.js). Designed for `discord.js@13`
```diff
- Less customization
+ Cleaner execution
```
### Install
```
npm i spud-petite@latest // 1.1.5
```

### Changelog 1.1.5

- Added an optional builder to create options for `Menu`
```js
const { MenuOption } = require('spud-petite')

const opt1 = new MenuOption()
    .setLabel('Some Label') // The option name
    .setValue() // Automatically handled, however custom ids can be passed if you wish.
    .setEmbed(new MessageEmbed().setTitle('test').setDescription('Monkey')) // Embed displayed
    .setDescription('munchee') // Description of option
```
### Usage

##### **Pagination:**
Constructor:
```js
new Pagination(message: Message, embeds: MessageEmbed[], time?: Number, fastSkip?: Boolean, trashBin?: Boolean)
```
Example:
```js
// Assuming you've defined your client somewhere...
const { Pagination } = require('spud-petite');

client.on('messageCreate', async (message) => {
    const embeds = [
        new MessageEmbed().setTitle('1').setDescription('Page 1'),
        new MessageEmbed().setTitle('2').setDescription('Page 2'),
        new MessageEmbed().setTitle('3').setDescription('Page 3'),
    ];

    if (message.content === 'page') {
        const page = new Pagination(message, embeds, 10000);
        await page.send();        
    };
});
```
##### **Menu:**

Constructor:
```js
new Menu(message: Message, placeholder?: String, options: MenuOptions[], time?: Number)
```
Example:
```js
// Assuming you've defined your client somehwere...
const { Menu } = require('spud-petite');

client.on('messageCreate', async (message) => {
    const opt1 = new MessageEmbed().setTitle('1').setDescription('Option 1');
    const opt2 = new MessageEmbed().setTitle('2').setDescription('Option 2');
    const opt3 = new MessageEmbed().setTitle('3').setDescription('Option 3');

    if (message.content === 'menu') {
        const menu = new Menu(message, 'Change option?', [
            {
                label: 'Option 1',
                description: 'The first option',
                embed: opt1
            },
            {
                label: 'Option 2',
                description: 'The second option',
                embed: opt2
            },
            {
                label: 'Option 3',
                description: 'The third option',
                embed: opt3
            }
        ], 10000)

        await menu.send()
    }
})
```

Planned:

- Interaction support [Not near future]
- Switch to `discord.js@14` [Not near future]
<sup><sub><sup>While this package is part of the spud.js family, it is NOT developed by the same user(s) that develop the main package</sup></sub></sup>