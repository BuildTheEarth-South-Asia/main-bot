import Client from "../struct/Client"
import Message from "../struct/discord/Message"
import Args from "../struct/Args"
import Command from "../struct/Command"
import TextChannel from "../struct/discord/TextChannel"
import Roles from "../util/roles"

export default new Command({
    name: "unlock",
    aliases: [],
    description: "Unlock the channel.",
    permission: Roles.MANAGER,
    usage: "[channel]",
    async run(this: Command, client: Client, message: Message, args: Args) {
        const channelID = args.consumeSnowflake()
        const suppliedChannel = await client.channels.fetch(channelID, true)
        const channel = <TextChannel>(suppliedChannel || message.channel)

        await channel.updateOverwrite(
            message.guild.id,
            { SEND_MESSAGES: null },
            `Unlocked by ${message.author.tag} (${message.author.id})`
        )

        message.channel.sendSuccess(`Unlocked ${channel}.`)
    }
})
