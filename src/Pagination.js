const { MessageActionRow, MessageButton, version } = require('discord.js');
const { SpudError } = require('../err');

const rows = {
    both: new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('left')
            .setStyle('PRIMARY')
            .setLabel('◀').setDisabled(false),
        new MessageButton()
            .setCustomId('right')
            .setStyle('PRIMARY')
            .setLabel('▶').setDisabled(false),
    ),
    right: new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('left')
            .setStyle('PRIMARY')
            .setLabel('◀').setDisabled(true),
        new MessageButton()
            .setCustomId('right')
            .setStyle('PRIMARY')
            .setLabel('▶').setDisabled(false),
    ),
    left: new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('left')
            .setStyle('PRIMARY')
            .setLabel('◀').setDisabled(false),
        new MessageButton()
            .setCustomId('right')
            .setStyle('PRIMARY')
            .setLabel('▶').setDisabled(true),
    ),
    none: new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('left')
            .setStyle('PRIMARY')
            .setLabel('◀').setDisabled(true),
        new MessageButton()
            .setCustomId('right')
            .setStyle('PRIMARY')
            .setLabel('▶').setDisabled(true),
    ),
};

exports.Pagination = class Pagination {
    constructor(message, embeds, time) {
        this.message = message;
        this.embeds = embeds ?? [];
        this.time = time ?? 5000;
    }
    async send() {
        if (!version.startsWith('13')) {
            throw new SpudError('Incorrect discord.js version, must be a v13');
        }

        let currentPage = 0;
        let currentRow = 'right';
        const filter = m => m.user.id === this.message.author.id;
        const len = this.embeds.length - 1;

        const msg = await this.message.channel.send({
            embeds: [
                this.embeds[currentPage],
            ],
            components: [
                rows[currentRow],
            ],
        });

        const collector = msg.createMessageComponentCollector({ filter, time: this.time });

        collector.on('collect', async (i) => {
            collector.resetTimer();
            if (i.customId === 'right') {
                currentPage++;
                currentPage === len ? currentRow = 'left' : currentRow = 'both';
                i.update({
                    embeds: [
                        this.embeds[currentPage],
                    ],
                    components: [
                        rows[currentRow],
                    ],
                });
            }
            if (i.customId === 'left') {
                currentPage--;
                currentPage === 0 ? currentRow = 'right' : currentRow = 'both';
                i.update({
                    embeds: [
                        this.embeds[currentPage],
                    ],
                    components: [
                        rows[currentRow],
                    ],
                });
            }
        });

        collector.on('end', () => {
            currentRow = 'none';
            msg.edit({
                components: [
                    rows[currentRow],
                ],
            });
        });
    }
};