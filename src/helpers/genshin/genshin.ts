/* eslint-disable import/order */

import Fuse from 'fuse.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { generateArtifactEmbed } from './artifacts';
import { generateBuildEmbed } from './characters';
import { generateWeaponEmbed } from './weapons';

import { artifacts } from './data/artifacts';
import { characters } from './data/characters';
import { weaponList } from './data/weaponMaterials';

const searchable = [
    ...Object.entries(weaponList).map(([key, data]) => ({
        key,
        type: 'weapon',
        name: data.name,
    })),
    ...Object.entries(characters).map(([key, data]) => ({
        key,
        type: 'character',
        name: data.name,
    })),
    ...Object.entries(artifacts).map(([key, data]) => ({
        key,
        type: 'artifact',
        name: data.name,
    })),
];

const engine = new Fuse(searchable, {
    keys: ['name'],
});

export async function recom(query: string): Promise<any> {
    return engine.search(query);
}

export async function search(query: string): Promise<any> {
    const result = engine.search(query);
    let ret = null;

    if (result.length > 0) {
        const item = result[0].item;
        switch (item.type) {
            case 'artifact':
                ret = generateArtifactEmbed(item.key);
                break;
            case 'weapon':
                ret = generateWeaponEmbed(item.key);
                break;
            case 'character':
                break;
        }
    } else {
        console.log(`Cannot find something about ${query} 😕`);
    }

    return ret;
}

export function getCurrentDay(offset = 0): string {
    const weekdays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    const time = dayjs().utcOffset(8);
    let day = time.day();

    if (time.hour() >= 0 && time.hour() < 4) {
        day -= 1;
    }

    day += offset;

    if (day < 0) {
        day = 7 - (Math.abs(day) % 7);
    } else if (day > 6) {
        day = day % 7;
    }

    return weekdays[day];
}