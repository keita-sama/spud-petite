const { MessageActionRow, MessageSelectMenu, version } = require('discord.js');
const { SpudError } = require('../err');

exports.Menu = class Menu {
    constructor(message, placeholder, options, time) {
        this.message = message;
        this.placeholder = placeholder ?? 'Choose an option';
        this.options = options;
        this.time = time ?? 5000;
    }
    async send() {
        if (!version.startsWith('13')) {
            throw new SpudError('Incorrect discord.js version, must be a v13');
        }
        const filter = m => m.user.id === this.message.author.id;
        const opt = this.options.map(option => {
            return {
                label: option.label,
                description: option.description,
                value: option.label.toLowerCase().replaceAll(' ', '_'),
                default: option?.default ?? false,
                emoji: option?.emoji ?? null,
            };
        });

        const menu = new MessageSelectMenu()
            .setPlaceholder(this.placeholder)
            .addOptions(...opt)
            .setCustomId('select');

        const msg = await this.message.channel.send({
            embeds: [
                this.options[0].embed,
            ],
            components: [
                new MessageActionRow().addComponents(menu),
            ],
        });

        const collector = msg.createMessageComponentCollector({ filter: filter, time: this.time });

        collector.on('collect', async (i) => {
            collector.resetTimer();
            const val = i.values[0];
            await i.update({
                embeds: [
                    this.options.find(option => option.label.toLowerCase().replaceAll(' ', '_') === val).embed,
                ],
            });
        });

        collector.on('end', () => {
            msg.edit({
                components: [
                    new MessageActionRow().addComponents(menu.setPlaceholder(`${this.placeholder} - Expired`).setDisabled(true)),
                ],
            });
        });
    }
};