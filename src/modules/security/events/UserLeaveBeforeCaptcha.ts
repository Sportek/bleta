import { GuildMember, TextChannel } from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { CaptchaManager } from "App/modules/security/CaptchaManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import Logger from "@leadcodedev/logger";


@Event('guildMemberRemove')
export default class UserLeaveBeforeCaptcha extends BaseEvent {
  public async run(member: GuildMember): Promise<void> {
    const memberid = member.id;
    const guild = member.guild
    const captcha = CaptchaManager.getInstance()
    const data = captcha.getPlayerListFromMessage(memberid)
    if(data.length !== 0) {
      try {
        captcha.removePlayerFromList(memberid)
        const channel = await guild.channels.fetch(ConfigManager.getSecurityConfiguration().channelID) as TextChannel;
        const message = await channel.messages.fetch(data[0].messageid)
        await message.delete()
      } catch (e) {
        Logger.send("error", "Impossible de supprimer le message, il n'existe probablement plus. (Captcha)")
      }
    }


  }
}