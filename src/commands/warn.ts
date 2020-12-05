import Client from "../struct/Client"
import Guild from "../struct/discord/Guild"
import DMChannel from "../struct/discord/DMChannel"
import Message from "../struct/discord/Message"
import ActionLog from "../entities/ActionLog"
import Command from "../struct/Command"
import Roles from "../util/roles"
import noop from "../util/noop"

export default new Command({
    name: "warn",
    aliases: [],
    description: "Warn a member.",
    permission: [Roles.HELPER, Roles.MODERATOR],
    usage: "<member> <reason>",
    async run(this: Command, client: Client, message: Message, args: string) {
        const result = await (<Guild>message.guild).members.find(args)
        args = result.args
        const target = result.member

        if (!target)
            return message.channel.sendError(
                target === undefined
                    ? `Couldn't find user \`${result.input}\`.`
                    : `You must provide a user to warn!`
            )

        const reason = args.trim()
        if (!reason) return message.channel.sendError("You must provide a reason!")
        message.channel.sendSuccess(`Warned ${target.user} • *${reason}*`)

        const dms = <DMChannel>target.user.dmChannel
        dms.sendError(`${message.author} has warned you:\n\n*${reason}*`).catch(noop)

        const log = new ActionLog()
        log.action = "warn"
        log.member = target.id
        log.executor = message.author.id
        log.reason = reason
        log.channel = message.channel.id
        log.message = message.id

        log.save()
    }
})
