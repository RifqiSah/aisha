import { resolve } from "path";
import { readFileSync } from 'fs';

function loadData(file: String) {
    const rawdata: Buffer = readFileSync(resolve(__dirname, `../../data/${file}`));
    return JSON.parse(rawdata.toString());
}

const dndrop = loadData('dndrop.json');
const dnhp = loadData('dnhp.json');
const dninfo = loadData('dninfo.json');
const dnrate = loadData('dnrate.json');

export default class Function {
    static getDate(): String {
        return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
    };

    static getAllowedRoles(role: string): Boolean {
        const allowedroles = ['668660316036530216', '668680264096022550', '676221506346549251'];
        return allowedroles.includes(role);
    };

    static getServerIP(name: String) {
        const serverIp = [
            { name: 'NA', ip: '211.43.155.163', port: 14300 },
            { name: 'KO', ip: '211.233.18.72', port: 14300 },
            { name: 'SEA', ip: '202.14.200.67', port: 14301 },
        ];

        return serverIp.find((x) => x.name === name);
    };

    static isDeveloper(member: any) {
        return member.roles.cache.some((role: any) => role.id === '433870492378595329');
    };

    static formatData(key: String) {
        let fmt: String;

        switch (key) {
            case 'dndrop':
                fmt = dndrop.map((item: any) => '> '.concat(item.key.join(', '))).join('\n');
                break;

            case 'dnhp':
                fmt = dnhp.map((item: any) => '> '.concat(item.key.join(', '))).join('\n');
                break;

            case 'dninfo':
                fmt = dninfo.map((item: any) => '> '.concat(item.key.join(', '))).join('\n');
                break;

            case 'dnrate':
                fmt = dnrate.map((item: any) => '> '.concat(item.key.join(', '))).join('\n');
                break;

            default:
                return null;
        }

        return fmt;
    };

    static getDNDropData(key: String) {
        const d: any = dndrop.find((item: any) => {
            const itemReg = new RegExp(item.key.join('|'), 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    };

    static getDNHpData(key: String) {
        const d: any = dnhp.find((item: any) => {
            const itemReg = new RegExp(item.key.join('|'), 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    };

    static getDNInfoData(key: String) {
        const d: any = dninfo.find((item: any) => {
            const itemReg = new RegExp(item.key.join('|'), 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    };

    static getDNRateData(key: String) {
        const d: any = dnrate.find((item: any) => {
            const itemReg = new RegExp(item.key.join('|'), 'g');
            if (!key.match(itemReg)) return null;

            return item;
        });

        if (!d) return null;
        return d;
    };
};