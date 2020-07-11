/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { Collection } from 'discord.js';
import { logger } from './logger';
import values from './values';

const externalDatas: Collection<string, any> = new Collection();

function loadDataFiles(dirs: string): void {
    const files = readdirSync(resolve(__dirname, `../../data/${dirs}`)).filter((f) => f.endsWith('.json'));
    for (const file of files) {
        const key = file.slice(0, -5);
        const rawdata: Buffer = readFileSync(resolve(__dirname, `../../data/${dirs}/${file}`));
        const parsed = JSON.parse(rawdata.toString());

        logger.info(`  + '${dirs}/${key}' readed and parsed.`);
        externalDatas.set(`${dirs}.${key}`, parsed);
    }
}

export default class Function {
    static loadData(): void {
        logger.info('[-] Reading external data');
        
        ['dragonnest'].forEach((x) => {
            loadDataFiles(x);
        });

        logger.info('[V] Done!');
    }

    static getDate(): string {
        return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
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
            { name: 'NA', ip: '211.43.155.163', port: 14300 },
            { name: 'KO', ip: '211.233.18.72', port: 14300 },
            { name: 'SEA', ip: '202.14.200.67', port: 14301 },
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

    static formatData(key: string): any {
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

        if (!data) {
            return null;
        }
        
        return data;
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
    
    static formatPercent(number: number) {
        const ret = number * 100;
        return `${ret.toFixed(2)}%`;
    }

    static formatNumber(number: number) {
        return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    static formatState(state: string) {
        const _getKeyValue_ = (key: string) => (obj: Record<string, any>) => obj[key];
        return _getKeyValue_(state)(values.STATES);
    }
}