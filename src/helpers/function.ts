/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { Collection } from 'discord.js';

import Fuse from 'fuse.js';
import moment from 'moment';

import { splitMessage } from './bot';
import axios from '../lib/axios';
import { logger } from '../lib/logger';
import values from '../lib/values';

const globalsvc = require('../database/services/globals.service');

const externalDatas: Collection<string, any> = new Collection();

async function getFileList(dir: string) {
    const response = await axios.get(`${values.aisha_v1_api}/data/${dir}`, {
        headers: {
            apikey: values.api_key,
        }
    });
    return response.data.data;
}

async function loadDataFiles(dirs: string) {
    const files: any = await getFileList(dirs);

    await Promise.all(files.map(async (file: string) => {
        const response = await axios.get(`${values.aisha_v1_api}/data/${dirs}/${file}`, {
            headers: {
                apikey: values.api_key,
            }
        });
        const data = response.data;

        const key = file.slice(0, -5);
        const parsed = data.data;

        logger.info(`  + '${dirs}/${key}' readed and parsed. [${data.length} bytes].`);
        externalDatas.set(`${dirs}.${key}`, parsed);
    }));
}

export function delay(ms: any) {
    return new Promise((res) => setTimeout(res, ms));
}

export async function loadData() {
    logger.info('[-] Clearing and Reading new external data');

    externalDatas.clear();

    await Promise.all(['dragonnest', 'bdm'].map(async (x) => {
        await loadDataFiles(x);
    }));

    logger.info('[V] Done!');
}

export function getDate(): string {
    return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
}

export function parseDate(date: string): moment.Moment {
    return moment(date);
}

export function getMonthName(): string {
    return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', month: 'long' });
}

export function getAllowedRoles(role: string): boolean {
    const allowedroles = ['668660316036530216', '668680264096022550', '676221506346549251'];
    return allowedroles.includes(role);
}

export function getServerIP(name: string): any {
    const serverIp = [
        { name: 'NA', ip: '110.234.17.5', port: 14300 },
        { name: 'KO', ip: '211.56.89.200', port: 14300 },
        { name: 'SEA', ip: '13.76.128.50', port: 14301 },
    ];

    return serverIp.find((x) => x.name === name);
}

export function isDeveloper(member: any): any {
    return member.roles.cache.some((role: any) => role.id === '433870492378595329');
}

export function commandRecom(key: string, subkey: string): string|undefined {
    let commands: string|undefined;

    commands = externalDatas?.get(`dragonnest.${key}`)?.map((item: any) => item.key.join(','));
    if (!commands) {
        return undefined;
    }

    commands = `,${commands},`.toString();
    const match = commands.match(new RegExp(`[^,?!]*(?<=[,?\\s!])${subkey}(?=[\\s,?!])[^,?!]*`, 'igm'));

    return match ? match.join(', ') : undefined;
}

export async function searchAutoComplete(dataKey: string, key: string): Promise<Array<{ name: string; value: string }>> {
    const data = externalDatas?.get(dataKey);
    const engine = new Fuse(data, {
        keys: ['name'],
        includeScore: true,
    });

    const result = engine.search(key, { limit: 25 });
    return result.map((e: any) => ({ name: e.item.name, value: e.item.key[0] }));
}

export async function searchAutoCompleteFromArray(data: any, option: string[], key: string): Promise<any> {
    const engine = new Fuse(data, {
        keys: option,
        includeScore: true,
    });
    return engine.search(key, { limit: 25 });
}

export function formatDataAutocomplete(key: string) {
    return externalDatas?.get(key)?.map((item: any) => item.key).sort();
}

export function formatData(key: string) {
    return externalDatas?.get(key)?.map((item: any) => '> '.concat(item.key.join(', '))).sort().join('\n');
}

export function getExternalData(dataKey: string, key: string) {
    const data = externalDatas?.get(dataKey)?.find((item: any) => {
        const itemReg = new RegExp(`\\b${item.key.join('|')}\\b`, 'g');
        if (!key.match(itemReg)) {
            return null;
        }

        return item;
    });

    return data ?? null;
}


export function formatPercent(number: number) {
    const ret = number * 100;
    return `${ret.toFixed(2).replace('.', ',')}%`;
}

export function formatNumber(number: any) {
    if (typeof number == 'string') {
        const isArray = number.match(new RegExp('-', 'g'));
        if (isArray) {
            return formatNumberArray(number);
        }
    }

    return formatNumberReal(number);
}

export function formatNumberReal(number: number) {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatNumberArray(number: any) {
    const num = new RegExp('(:?^|\\s)(?=.)((?:0|(?:[1-9](?:\\d*|\\d{0,2}(?:,\\d{3})*)))?(?:\\.\\d*[1-9])?)(?!\\S)', 'g');
    const numbers = number.match(num)?.map((x: number) => formatNumber(x));

    return numbers.join(' - ');
}

export function formatTitleCase(str: string) {
    return str.replace(/\w\S*/g, function(txt: string) {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
}

export function formatTitleCaseOld(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function formatImageInMessage(msg: any, message: any, data: any) {
    data.data.map((id: string) => {
        msg.push(id);
        if (/(https?:\/\/[^\s]+)/.test(id)) {
            // msg.pop();
            message.channel.send(msg.join('\n'), { split: true/*, files: [id]*/ });
            msg.length = 0;
        }
    });
}

export async function formatImageInInteraction(msg: any, interaction: any, data: any) {
    let index = 0;

    for (let i = 0; i < data.data.length; i++) {
        const id = data.data[i];
        msg.push(id);
        if (/(https?:\/\/[^\s]+)/.test(id)) {
            if (index === 0) {
                await interaction.editReply({ content: msg.join('\n'), }).then((a: any) => {
                    index++;
                });
            } else {
                await interaction.followUp({ content: msg.join('\n'), });
            }

            msg.length = 0;
            index++;
        }
    }
}

export function sendMessage(msgObj: any, message: any) {
    let str = message;

    if (Array.isArray(str)) {
        str = message.join('\n');
    }

    str = splitMessage(str);
    str.forEach((ele: string) => {
        return ele ? msgObj.channel.send(ele) : null;
    });
}

export function sendMessageChannel(chObj: any, message: any) {
    let str = message;

    if (Array.isArray(str)) {
        str = message.join('\n');
    }

    str = splitMessage(str);
    str.forEach((ele: string) => {
        return ele ? chObj.send(ele) : null;
    });
}

export function getDirs(dir: string): string[] {
    dir = resolve(__dirname, `../${dir}`);
    return readdirSync(dir, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
}

export async function getWebhookUrls(webhook: string) {
    const urls = await globalsvc.findAll({
        where: {
            key: webhook,
        },
    });
    return urls.map((url: any) => url.value);
}

export function getFileExtensionFromUrl(url: string) {
    return url?.split(/[#?]/)[0]?.split('.')?.pop()?.trim();
}

export function humanFileSize(bytes: number, dp=1) {
    const thresh = 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

export function getContentFromHtmlString(from: string) {
    let str = from;

    // replace html
    const htmlRegex = /(<([^>]+)>)/ig;
    str = str.replace(htmlRegex, '');

    // check tanda baca
    const punctuationRegex = /\s*([,.!?:;]+)(?!\s*$)\s*/g;
    str = str.replace(punctuationRegex, '$1 ');

    return trimString(str, 300);
}

export function trimString(string: string, length: number) {
    return string.length > length ? string.substring(0, length) + '...' : string;
}