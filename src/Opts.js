/* eslint-disable no-empty-function */

exports.MenuOption = class MenuOption {
    constructor() {
        this.label = undefined;
        this.value = undefined;
        this.description = null;
        this.default = false,
        this.emoji = null;
        this.embed = undefined;
    }
    setLabel(label) {
        this.label = label;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setEmbed(embed) {
        this.embed = embed;
        return this;
    }
    setValue(value) {
        this.value = value ?? this.label.toLowerCase().replaceAll(' ', '_');
        return this;
    }
    setDefault(_default) {
        this.default = _default;
        return this;
    }
    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }
};