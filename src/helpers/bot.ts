/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Util } from 'discord.js';
import { logger } from '../lib/logger';

export function toString(obj: any, message: any) {
    let str = message;

    if (Array.isArray(str)) {
        str = message.join('\n');
    }

    return Util.splitMessage(str);
}

export async function sendAndDelete(obj: any, message: any, timeout: number): Promise<any> {
    let str = message;

    if (Array.isArray(str)) {
        str = message.join('\n');
    }

    str = Util.splitMessage(str);
    str.forEach((ele: string) => {
        if (ele) {
            return obj.channel.send(ele).then((msg: any) => setTimeout(() => msg.delete(), timeout)).catch((err: any) => {
                logger.error(err);
            });
        } else {
            return null;
        }
    });
}

export async function editAndDelete(obj: any, message: any, timeout: number): Promise<any> {
    obj.edit(message).then((msg: any) => setTimeout(() => msg.delete(), timeout)).catch((err: any) => {
        logger.error(err);
    });
}

export async function replyAndDelete(obj: any, message: any, timeout: number): Promise<any> {
    obj.reply(message).then((msg: any) => setTimeout(() => msg.delete(), timeout)).catch((err: any) => {
        logger.error(err);
    });
}