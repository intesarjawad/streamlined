import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

export const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID!;
export const REQUIRED_ROLE_ID = process.env.DISCORD_REQUIRED_ROLE_ID!;
export const ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID!;

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

export async function getMemberRoles(userId: string) {
  try {
    const member = await rest.get(
      Routes.guildMember(DISCORD_SERVER_ID, userId)
    ) as { roles: string[] };
    return member.roles;
  } catch (error) {
    console.error('Failed to get member roles:', error);
    return [];
  }
}

export async function getMemberInfo(userId: string) {
  try {
    const member = await rest.get(
      Routes.guildMember(DISCORD_SERVER_ID, userId)
    ) as {
      user: { 
        id: string; 
        username: string;
        discriminator: string;
        avatar: string;
        global_name: string;
      };
      roles: string[];
      nick: string | null;
    };
    
    console.log('Member info:', {
      nick: member.nick,
      global_name: member.user.global_name,
      username: member.user.username
    });
    
    const displayName = member.nick || member.user.global_name || member.user.username;
    
    return {
      id: member.user.id,
      name: displayName,
      email: null,
      image: member.user.avatar 
        ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.user.discriminator) % 5}.png`,
      roles: member.roles,
    };
  } catch (error) {
    console.error('Failed to get member info:', error);
    return null;
  }
}