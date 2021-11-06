/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { Collection, Util } from 'discord.js';
import moment from 'moment';
import { get } from 'superagent';
import { logger } from './logger';
import values from './values';


const externalDatas: Collection<string, any> = new Collection();

async function getFileList(dir: string) {
    const response = await get(`${values.aisha_api}/data/${dir}`);
    return JSON.parse(response.text);
}

async function loadDataFiles(dirs: string) {
    const files: any = await getFileList(dirs);

    files.forEach(async (file: string) => {
        const response = await get(`${values.aisha_api}/data/${dirs}/${file}`);
        const data = response.text;

        const key = file.slice(0, -5);
        const parsed = JSON.parse(data);

        logger.info(`  + '${dirs}/${key}' readed and parsed. [${data.length} bytes].`);
        externalDatas.set(`${dirs}.${key}`, parsed);
    });
}

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

export default class Function {
    static async loadData() {
        logger.info('[-] Clearing and Reading new external data');

        externalDatas.clear();

        ['dragonnest'].map(async (x) => {
            await loadDataFiles(x);
        });

        await delay(10000);

        logger.info('[V] Done!');
    }

    static getDate(): string {
        return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
    }

    static parseDate(date: string): moment.Moment {
        return moment(date);
    }

    static getMonthName(): string {
        return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', month: 'long' });
    }

    static getAllowedRoles(role: string): boolean {
        const allowedroles = ['668660316036530216', '668680264096022550', '676221506346549251'];
        return allowedroles.includes(role);
    }

    static getServerIP(name: string): any {
        const serverIp = [
            { name: 'NA', ip: '110.234.17.5', port: 14300 },
            { name: 'KO', ip: '211.56.89.200', port: 14300 },
            { name: 'SEA', ip: '13.76.128.50', port: 14301 },
        ];

        return serverIp.find((x) => x.name === name);
    }

    static isDeveloper(member: any): any {
        return member.roles.cache.some((role: any) => role.id === '433870492378595329');
    }

    static commandRecom(key: string, subkey: string): string|undefined {
        let commands: string|undefined;

        commands = externalDatas?.get(`dragonnest.${key}`)?.map((item: any) => item.key.join(','));
        if (!commands) {
            return undefined;
        }

        commands = `,${commands},`.toString();
        const match = commands.match(new RegExp(`[^,?!]*(?<=[,?\\s!])${subkey}(?=[\\s,?!])[^,?!]*`, 'igm'));

        return match ? match.join(', ') : undefined;
    }

    static formatData(key: string) {
        return externalDatas?.get(`dragonnest.${key}`)?.map((item: any) => '> '.concat(item.key.join(', '))).sort().join('\n');
    }

    static getExternalData(dataKey: string, key: string) {
        const data = externalDatas?.get(dataKey)?.find((item: any) => {
            const itemReg = new RegExp(`\\b${item.key.join('|')}\\b`, 'g');
            if (!key.match(itemReg)) {
                return null;
            }

            return item;
        });

        return data ?? null;
    }

    static getIconCoordinates(itemIconIndex: number) {
        const page = Math.floor(Number(itemIconIndex) / 200) + 1;
        const pageIdx = itemIconIndex % 200;
        const row = Math.floor(pageIdx / 10);
        const column = pageIdx % 10;
        const UNIT_SIZE = 50;

        const ret = {
            page: page,
            x: Math.max(UNIT_SIZE * column, 0),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE
        };

        return ret;
    }

    static getItemIconPageUrl(page: number) {
        let pageStr;
        if (page < 10) {
            pageStr = '0' + page;
        } else {
            pageStr = page;
        }

        return `${values.divinitor_api}/dds/itemicon${pageStr}/png`;
    }

    static getSlotOverlay(rank: any, type: string) {
        const UNIT_SIZE = 52;
        const ret = {
            url: `${values.divinitor_api}/dds/uit_itemslotbutton_o.dds/png`,
            x: 0,
            y: 0,
        };

        const isWeap = type === 'WEAPON' || type === 'PARTS';

        if (rank === 'NORMAL' || rank === 0) {
            if (isWeap) {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 0 * UNIT_SIZE;
            } else {
                ret.x = 2 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            }
        }

        if (rank === 'MAGIC' || rank === 1) {
            if (isWeap) {
                ret.x = 6 * UNIT_SIZE;
                ret.y = 1 * UNIT_SIZE;
            } else {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 1 * UNIT_SIZE;
            }
        }

        if (rank === 'RARE' || rank === 2) {
            if (isWeap) {
                ret.x = 6 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            } else {
                ret.x = 6 * UNIT_SIZE;
                ret.y = 0 * UNIT_SIZE;
            }
        }

        if (rank === 'EPIC' || rank === 3) {
            if (isWeap) {
                ret.x = 7 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            } else {
                ret.x = 8 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            }
        }

        if (rank === 'UNIQUE' || rank === 4) {
            if (isWeap) {
                ret.x = 7 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            } else {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            }
        }

        if (rank === 'LEGENDARY' || rank === 5) {
            ret.x = 5 * UNIT_SIZE;
            ret.y = 3 * UNIT_SIZE;
        }

        if (rank === 'DIVINE' || rank === 6) {
            if (isWeap) {
                ret.x = 4 * UNIT_SIZE;
                ret.y = 1 * UNIT_SIZE;
            } else {
                ret.x = 1 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            }
        }

        if (rank === 'ANCIENT' || rank === 7) {
            ret.url = `${values.divinitor_api}/dds/uit_itemslotbutton.dds/png`;
            if (isWeap) {
                ret.x = 1 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            } else {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            }
        }

        return ret;
    }

    static getKeyValue(key: string) {
        return (obj: Record<string, any>) => obj[key];
    }

    static formatPercent(number: number) {
        const ret = number * 100;
        return `${ret.toFixed(2).replace('.', ',')}%`;
    }

    static formatNumber(number: any) {
        if (typeof number == 'string') {
            const isArray = number.match(new RegExp('-', 'g'));
            if (isArray) {
                return this.formatNumberArray(number);
            }
        }

        return this.formatNumberReal(number);
    }

    static formatNumberReal(number: number) {
        return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    static formatNumberArray(number: any) {
        const num = new RegExp('(:?^|\\s)(?=.)((?:0|(?:[1-9](?:\\d*|\\d{0,2}(?:,\\d{3})*)))?(?:\\.\\d*[1-9])?)(?!\\S)', 'g');
        const numbers = number.match(num)?.map((x: number) => this.formatNumber(x));

        return numbers.join(' - ');
    }

    static formatState(state: string) {
        return this.getKeyValue(state)(values.STATES);
    }

    static combineState(states: any, stateKey?: any) {
        const combined: any = [];
        let obj: any = {};

        if (!stateKey) {
            stateKey = 'min';
        }

        for (const i in states) {
            const state = states[i];
            const val = state[stateKey];

            if (state.state === 'PHYSICAL_DAMAGE_MIN') {
                obj = {};

                obj.state = 'PHYSICAL_DAMAGE_MINMAX';
                obj.min = val;
            } else if (state.state === 'PHYSICAL_DAMAGE_MAX') {
                if (obj.state === 'PHYSICAL_DAMAGE_MINMAX') {
                    obj.min = obj.min + ' - ' + val;
                }

                combined.push(obj);
            } else if (state.state === 'MAGICAL_DAMAGE_MIN') {
                obj = {};

                obj.state = 'MAGICAL_DAMAGE_MINMAX';
                obj.min = val;
            } else if (state.state === 'MAGICAL_DAMAGE_MAX') {
                if (obj.state === 'MAGICAL_DAMAGE_MINMAX') {
                    obj.min = obj.min + ' - ' + val;
                }

                combined.push(obj);
            } else if (state.state === 'PHYSICAL_DAMAGE_MIN_PERCENT') {
                obj = {};

                obj.state = 'PHYSICAL_DAMAGE_MINMAX_PERCENT';
                obj.min = val;
            } else if (state.state === 'PHYSICAL_DAMAGE_MAX_PERCENT') {
                if (obj.state === 'PHYSICAL_DAMAGE_MINMAX_PERCENT') {
                    obj.min = obj.min + ' - ' + val;
                }

                combined.push(obj);
            } else if (state.state === 'MAGICAL_DAMAGE_MIN_PERCENT') {
                obj = {};

                obj.state = 'MAGICAL_DAMAGE_MINMAX_PERCENT';
                obj.min = val;
            } else if (state.state === 'MAGICAL_DAMAGE_MAX_PERCENT') {
                if (obj.state === 'MAGICAL_DAMAGE_MINMAX_PERCENT') {
                    obj.min = obj.min + ' - ' + val;
                }

                combined.push(obj);
            } else {
                combined.push(state);
            }
        }

        // console.log(states);
        // console.log(combined);

        return combined;
    }

    static formatTitleCase(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static async formatImageInMessage(msg: any, message: any, data: any) {
        // for (let i = 0; i < data.data.length + 1; i++) {
        //     const id = data.data[i];
        //     const urlRegex = /(https?:\/\/[^\s]+)/;

        //     msg.push(id);
        //     if (urlRegex.test(id)) {
        //         msg.pop();

        //         const url = id.match(urlRegex)[1];
        //         await message.channel.send(msg, { split: true, files: [url] });

        //         msg.length = 0;
        //     }
        // }

        data.data.map((id: string) => {
            msg.push(id);
            if (/(https?:\/\/[^\s]+)/.test(id)) {
                // msg.pop();
                message.channel.send(msg.join('\n'), { split: true/*, files: [id]*/ });
                msg.length = 0;
            }
        });
    }

    static sendMessage(msgObj: any, message: any) {
        let str = message;

        if (Array.isArray(str)) {
            str = message.join('\n');
        }

        str = Util.splitMessage(str);
        str.forEach((ele: string) => {
            return ele ? msgObj.channel.send(ele) : null;
        });
    }

    static sendMessageChannel(chObj: any, message: any) {
        let str = message;

        if (Array.isArray(str)) {
            str = message.join('\n');
        }

        str = Util.splitMessage(str);
        str.forEach((ele: string) => {
            return ele ? chObj.send(ele) : null;
        });
    }
}