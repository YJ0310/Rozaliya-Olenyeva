module.exports = {
    /**
     * This function is for array in object 
     * @example list : [{list_1: 1}, {list_2: 2}]
     * @param {String} group group required 
     * @example level_roles, permissions, channels, voice_channel_xp_bonus
     * @param {[String, Integer]} key the key 
     * @example level_roles = level, permissions = command, channels = type, voice_channel_xp_bonus = bonus_amount
     * @returns 
     */
    async get_config_data(group, key) {
        const config = await require(`../../config.json`);
        const args = await config[group].find(x => x.key === key);
        return args;
    }
}