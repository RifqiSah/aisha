/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { verifyString } from 'discord.js';
import { logger } from '../lib/logger';

export function splitMessage(text: any, { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}) {
    text = verifyString(text);
    if (text.length <= maxLength) return [text];
    let splitText = [text];
    if (Array.isArray(char)) {
        while (char.length > 0 && splitText.some((elem) => elem.length > maxLength)) {
            const currentChar = char.shift();
            if (currentChar instanceof RegExp) {
                splitText = splitText.flatMap((chunk) => chunk.match(currentChar));
            } else {
                splitText = splitText.flatMap((chunk) => chunk.split(currentChar));
            }
        }
    } else {
        splitText = text.split(char);
    }

    if (splitText.some((elem) => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
        if (msg && (msg + char + chunk + append).length > maxLength) {
            messages.push(msg + append);
            msg = prepend;
        }
        msg += (msg && msg !== prepend ? char : '') + chunk;
    }

    return messages.concat(msg).filter((m) => m);
}

export function toString(obj: any, message: any) {
    let str = message;
    if (Array.isArray(str)) str = message.join('\n');

    return splitMessage(str);
}

export async function sendAndDelete(obj: any, message: any, timeout: number): Promise<any> {
    let str = message;
    if (Array.isArray(str)) str = message.join('\n');

    str = splitMessage(str);
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
    let str = message;
    if (Array.isArray(str)) str = message.join('\n');

    obj.edit(str).then((msg: any) => setTimeout(() => msg.delete(), timeout)).catch((err: any) => {
        logger.error(err);
    });
}

export async function replyAndDelete(obj: any, message: any, timeout: number): Promise<any> {
    let str = message;
    if (Array.isArray(str)) str = message.join('\n');

    obj.reply(str).then((msg: any) => setTimeout(() => msg.delete(), timeout)).catch((err: any) => {
        logger.error(err);
    });
}