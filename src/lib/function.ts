/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GuildAuditLogsEntry } from 'discord.js';

function loadData(file: string) {
    const rawdata: Buffer = readFileSync(resolve(__dirname, `../../data/${file}`));
    return JSON.parse(rawdata.toString());
}

const dndrop = loadData('dndrop.json');
const dnhp = loadData('dnhp.json');
const dninfo = loadData('dninfo.json');
const dnrate = loadData('dnrate.json');

const STATES = {
    STRENGTH: {
        name: 'Strength',
        abbv: 'STR',
        type: 'stat',
    },
    AGILITY: {
        name: 'Agility',
        abbv: 'AGI',
        type: 'stat',
    },
    INTELLECT: {
        name: 'Intellect',
        abbv: 'INT',
        type: 'stat',
    },
    VITALITY: {
        name: 'Vitality',
        abbv: 'VIT',
        type: 'stat',
    },
    PHYSICAL_DAMAGE_MIN: {
        name: 'Physical Damage (Min)',
        abbv: 'PDMG (Min)',
        type: 'stat',
        minmax: 'PHYSICAL_DAMAGE_MINMAX',
        mxt: 'min',
    },
    PHYSICAL_DAMAGE_MAX: {
        name: 'Physical Damage (Max)',
        abbv: 'PDMG (Max)',
        type: 'stat',
        minmax: 'PHYSICAL_DAMAGE_MINMAX',
        mxt: 'max',
    },
    MAGICAL_DAMAGE_MIN: {
        name: 'Magic Damage (Min)',
        abbv: 'MDMG (Min)',
        type: 'stat',
        minmax: 'MAGICAL_DAMAGE_MINMAX',
        mxt: 'min',
    },
    MAGICAL_DAMAGE_MAX: {
        name: 'Magic Damage (Max)',
        abbv: 'MDMG (Max)',
        type: 'stat',
        minmax: 'MAGICAL_DAMAGE_MINMAX',
        mxt: 'max',
    },
    PHYSICAL_DEFENSE: {
        name: 'Defense',
        abbv: 'PDEF',
        type: 'stat',
    },
    MAGICAL_DEFENSE: {
        name: 'Magic Defense',
        abbv: 'MDEF',
        type: 'stat',
    },
    PARALYZE: {
        name: 'Paralyze',
        abbv: 'PARA',
        type: 'stat',
    },
    PARALYZE_RESIST: {
        name: 'Paralyze Resist',
        abbv: 'PARA RESIST',
        type: 'stat',
    },
    CRITICAL: {
        name: 'Critical',
        abbv: 'CRIT',
        type: 'stat',
    },
    CRITICAL_RESIST: {
        name: 'Critical Resist',
        abbv: 'CRIT RESIST',
        type: 'stat',
    },
    STUN: {
        name: 'Stun',
        abbv: 'STUN',
        type: 'stat',
    },
    STUN_RESIST: {
        name: 'Stun Resist',
        abbv: 'STUN RESIST',
        type: 'stat',
    },
    FIRE_ATTACK: {
        name: 'Fire',
        abbv: 'FIRE',
        type: 'percent',
    },
    ICE_ATTACK: {
        name: 'Ice',
        abbv: 'ICE',
        type: 'percent',
    },
    LIGHT_ATTACK: {
        name: 'Light',
        abbv: 'LIGHT',
        type: 'percent',
    },
    DARK_ATTACK: {
        name: 'Dark',
        abbv: 'DARK',
        type: 'percent',
    },
    FIRE_DEFENSE: {
        name: 'Fire',
        abbv: 'FIRE',
        type: 'percent',
    },
    ICE_DEFENSE: {
        name: 'Ice Defense',
        abbv: 'ICE DEF',
        type: 'percent',
    },
    LIGHT_DEFENSE: {
        name: 'Light Defense',
        abbv: 'LIGHT DEF',
        type: 'percent',
    },
    DARK_DEFENSE: {
        name: 'Dark Defense',
        abbv: 'DARK DEF',
        type: 'percent',
    },
    HP: {
        name: 'HEALTH',
        abbv: 'HP',
        type: 'stat',
    },
    MANA: {
        name: 'MANA',
        abbv: 'MP',
        type: 'stat',
    },
    TWENTY_SEVEN: {
        name: '27',
        abbv: '27',
        type: 'stat',
    },
    FINAL_DAMAGE: {
        name: 'Final Damage',
        abbv: 'FD',
        type: 'stat',
    },
    THIRTY: {
        name: '30',
        abbv: '30',
        type: 'stat',
    },
    PHYSICAL_DAMAGE_MINMAX: {
        name: 'Physical Damage',
        abbv: 'PDMG',
        type: 'stat',
        combined: true,
        children: [
            'PHYSICAL_DAMAGE_MIN',
            'PHYSICAL_DAMAGE_MAX',
        ],
    },
    MAGICAL_DAMAGE_MINMAX: {
        name: 'Magic Damage',
        abbv: 'MDMG',
        type: 'stat',
        combined: true,
        children: [
            'MAGICAL_DAMAGE_MIN',
            'MAGICAL_DAMAGE_MAX',
        ],
    },
    MOVEMENT_SPEED: {
        name: 'Movement Speed',
        abbv: 'MOVE',
        type: 'stat',
    },
    MANA_RECOVERY: {
        name: 'Mana Recovery',
        abbv: 'MP REGEN',
        type: 'stat',
    },
    SAFE_ZONE_MOVEMENT_SPEED: {
        name: 'Safe Zone Movement Speed',
        abbv: 'SAFE MOVE',
        type: 'stat',
    },
    STRENGTH_PERCENT: {
        name: '% Strength',
        abbv: '% STR',
        type: 'percent',
    },
    AGILITY_PERCENT: {
        name: '% Agility',
        abbv: '% AGI',
        type: 'percent',
    },
    INTELLECT_PERCENT: {
        name: '% Intellect',
        abbv: '% INT',
        type: 'percent',
    },
    VITALITY_PERCENT: {
        name: '% Vitalty',
        abbv: '% VIT',
        type: 'percent',
    },
    PHYSICAL_DAMAGE_MIN_PERCENT: {
        name: '% Physical Damage (Min)',
        abbv: '% PDMG (Min)',
        type: 'percent',
        minmax: 'PHYSICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'min',
    },
    PHYSICAL_DAMAGE_MAX_PERCENT: {
        name: '% Physical Damage (Max)',
        abbv: '% PDMG (Max)',
        type: 'percent',
        minmax: 'PHYSICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'max',
    },
    MAGICAL_DAMAGE_MIN_PERCENT: {
        name: '% Magic Damage (Min)',
        abbv: '% MDMG (Min)',
        type: 'percent',
        minmax: 'MAGICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'min',
    },
    MAGICAL_DAMAGE_MAX_PERCENT: {
        name: '% Magic Damage (Max)',
        abbv: '% MDMG (Max)',
        type: 'percent',
        minmax: 'MAGICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'max',
    },
    PHYSICAL_DEFENSE_PERCENT: {
        name: '% Physical Defense',
        abbv: '% PDEF',
        type: 'percent',
    },
    MAGICAL_DEFENSE_PERCENT: {
        name: '% Magic Defense',
        abbv: '% MDEF',
        type: 'percent',
    },
    PARALYZE_PERCENT: {
        name: '% Paralyze',
        abbv: '% PARA',
        type: 'percent',
    },
    PARALYZE_RESIST_PERCENT: {
        name: '% Paralyze Resist',
        abbv: '% PARA RESIST',
        type: 'percent',
    },
    CRITICAL_PERCENT: {
        name: '% Critical',
        abbv: '% CRIT',
        type: 'percent',
    },
    CRITICAL_RESIST_PERCENT: {
        name: '% Critical Resist',
        abbv: '% CRIT RESIST',
        type: 'percent',
    },
    STUN_PERCENT: {
        name: '% Stun',
        abbv: '% STUN',
        type: 'percent',
    },
    STUN_RESIST_PERCENT: {
        name: '% Stun Resist',
        abbv: '% STUN RESIST',
        type: 'percent',
    },
    MOVEMENT_SPEED_PERCENT: {
        name: '% Movement Speed',
        abbv: '% MOVE',
        type: 'percent',
    },
    HP_PERCENT: {
        name: '% Health',
        abbv: '% HP',
        type: 'percent',
    },
    MP_PERCENT: {
        name: '% Mana',
        abbv: '% MP',
        type: 'percent',
    },
    MANA_RECOVERY_PERCENT: {
        name: '% Mana Recovery',
        abbv: '% MP REGEN',
        type: 'percent',
    },
    FINAL_DAMAGE_PERCENT: {
        name: '% Final Damage',
        abbv: '% FD',
        type: 'percent',
    },
    SAFE_ZONE_MOVEMENT_SPEED_PERCENT: {
        name: '% Safe Zone Movement Speed',
        abbv: '% SAFE MOVE',
        type: 'percent',
    },
    PHYSICAL_DAMAGE_MINMAX_PERCENT: {
        name: '% Physical Damage',
        abbv: '% PDMG',
        type: 'percent',
        combined: true,
        children: [
            'PHYSICAL_DAMAGE_MIN_PERCENT',
            'PHYSICAL_DAMAGE_MAX_PERCENT',
        ],
    },
    MAGICAL_DAMAGE_MINMAX_PERCENT: {
        name: '% Magic Damage',
        abbv: '% MDMG',
        type: 'percent',
        combined: true,
        children: [
            'MAGICAL_DAMAGE_MIN_PERCENT',
            'MAGICAL_DAMAGE_MAX_PERCENT',
        ],
    },
    CRITICAL_DAMAGE: {
        name: 'Critical Damage',
        abbv: 'CRIT DMG',
        type: 'stat',
    },
    CRITICAL_DAMAGE_PERCENT: {
        name: '% Critical Damage',
        abbv: '% CRIT DMG',
        type: 'percent',
    },
    ONE_HUNDRED_SEVEN: {
        name: '107',
        abbv: '107',
        type: 'stat',
        obsolete: true
    },
    STAT: {
        name: 'STR/AGI/INT/VIT',
        abbv: 'STAT',
        type: 'stat',
        children: [
            'STRENGTH',
            'AGILITY',
            'INTELLECT',
            'VITALITY'
        ]
    },
    ELE: {
        name: 'Elemental ATK',
        abbv: 'ELE',
        type: 'percent',
        children: [
            'LIGHT_ATTACK',
            'DARK_ATTACK',
            'FIRE_ATTACK',
            'ICE_ATTACK'
        ]
    },
    STAT_PERCENT: {
        name: 'STR%/AGI%/INT%/VIT%',
        abbv: 'STAT%',
        type: 'percent',
        children: [
            'STRENGTH_PERCENT',
            'AGILITY_PERCENT',
            'INTELLECT_PERCENT',
            'VITALITY_PERCENT'
        ]
    },
};

export default class Function {
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

        switch (key) {
            case 'dndrop':
                commands = dndrop.map((item: any) => item.key.join(','));
                break;

            case 'dnhp':
                commands = dnhp.map((item: any) => item.key.join(','));
                break;

            case 'dninfo':
                commands = dninfo.map((item: any) => item.key.join(','));
                break;

            case 'dnrate':
                commands = dnrate.map((item: any) => item.key.join(','));
                break;

            default:
                commands = undefined;
        }

        if (!commands) return undefined;

        commands = `,${commands},`.toString();
        const match = commands.match(new RegExp(`[^,?!]*(?<=[,?\\s!])${subkey}(?=[\\s,?!])[^,?!]*`, 'igm'));

        return match ? match.join(', ') : undefined;
    }

    static formatData(key: string): any {
        let fmt: string;

        switch (key) {
            case 'dndrop':
                fmt = dndrop.map((item: any) => '> '.concat(item.key.join(', '))).sort().join('\n');
                break;

            case 'dnhp':
                fmt = dnhp.map((item: any) => '> '.concat(item.key.join(', '))).sort().join('\n');
                break;

            case 'dninfo':
                fmt = dninfo.map((item: any) => '> '.concat(item.key.join(', '))).sort().join('\n');
                break;

            case 'dnrate':
                fmt = dnrate.map((item: any) => '> '.concat(item.key.join(', '))).sort().join('\n');
                break;

            default:
                return null;
        }

        return fmt;
    }

    static getDNDropData(key: string) {
        const d: any = dndrop.find((item: any) => {
            const itemReg = new RegExp(`\\b${item.key.join('|')}\\b`, 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    }

    static getDNHpData(key: string) {
        const d: any = dnhp.find((item: any) => {
            const itemReg = new RegExp(`\\b${item.key.join('|')}\\b`, 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    }

    static getDNInfoData(key: string) {
        const d: any = dninfo.find((item: any) => {
            const itemReg = new RegExp(`\\b${item.key.join('|')}\\b`, 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    }

    static getDNRateData(key: string) {
        const d: any = dnrate.find((item: any) => {
            const itemReg = new RegExp(`\\b${item.key.join('|')}\\b`, 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
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
        return _getKeyValue_(state)(STATES);
    }
}