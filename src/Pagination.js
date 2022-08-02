const { MessageActionRow, MessageButton } = require('discord.js');
// const { SpudError } = require('../err');

function checkPage(cur, components, min, max) {
    switch (cur) {
        case min:
            return new MessageActionRow().addComponents(...components.map(btn => btn.customId.startsWith('left') ? btn.setDisabled(true) : btn.setDisabled(false)));
        case max:
            return new MessageActionRow().addComponents(...components.map(btn => btn.customId.startsWith('right') ? btn.setDisabled(true) : btn.setDisabled(false)));
        case 'none':
            return new MessageActionRow().addComponents(...components.map(btn => btn.setDisabled(true)));
        case 'all':
            return new MessageActionRow().addComponents(...components.map(btn => btn.setDisabled(false)));
        default:
            return new MessageActionRow().addComponents(...components.map(btn => btn.setDisabled(false)));
    }
}

function update(interaction, embedArr, cur, row) {
    return interaction.update({
        embeds: [
            embedArr[cur],
        ],
        components: [
            row,
        ],
    });
}

function createButton(id, emoji, style) {
    return new MessageButton()
        .setCustomId(id)
        .setEmoji(emoji)
        .setStyle(style);
}

exports.Pagination = class Pagination {
    constructor(message, embeds, time, fastSkip, trashBin) {
        this.message = message;
        this.embeds = embeds;
        this.time = time ?? 5000;
        this.trashBin = trashBin ?? false;
        this.fastSkip = fastSkip ?? false;
    }
    async send() {
        const components = [];
        const trash = createButton('trash', '🗑', 'DANGER');
        const right = createButton('right', '▶', 'PRIMARY');
        const dright = createButton('rightf', '⏭', 'PRIMARY');
        const left = createButton('left', '◀', 'PRIMARY');
        const dleft = createButton('leftf', '⏮', 'PRIMARY');

        if (this.trashBin === true) {
            components.push(left, trash, right);
        }
        else {
            components.push(left, right);
        }
        if (this.fastSkip === true) {
            components.unshift(dleft);
            components.push(dright);
        }

        let currentPage = 0;
        const filter = m => m.user.id === this.message.author.id;
        const len = this.embeds.length - 1;

        const msg = await this.message.channel.send({
            embeds: [
                this.embeds[currentPage],
            ],
            components: [
                checkPage('all', components, 0, len),
            ],
        });

        const collector = msg.createMessageComponentCollector({ filter, time: this.time });

        collector.on('collect', async (i) => {
            collector.resetTimer();
            if (i.customId === 'right') {
                currentPage++;
                update(i, this.embeds, currentPage, checkPage(currentPage, components, 0, len));
            }
            if (i.customId === 'left') {
                currentPage--;
                update(i, this.embeds, currentPage, checkPage(currentPage, components, 0, len));
            }
            if (i.customId === 'rightf') {
                currentPage = len;
                update(i, this.embeds, currentPage, checkPage(currentPage, components, 0, len));
            }
            if (i.customId === 'leftf') {
                currentPage = 0;
                update(i, this.embeds, currentPage, checkPage(currentPage, components, 0, len));
            }
            if (i.customId === 'trash') {
                i.update({
                    components: [
                        new MessageActionRow().addComponents(...components.map(btn => btn.setDisabled(true))),
                    ],
                });
                collector.stop();
            }
        });

        collector.on('end', () => {
            msg.edit({
                components: [
                    checkPage('none', components, 0, len),
                ],
            });
        });
    }
};