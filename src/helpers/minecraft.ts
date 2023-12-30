import axios from '../lib/axios';
import config from '../lib/config';

/**
 * Virtual Machine
 */
export const vmInfo = async () => {
    const result = await axios.get(`${config.IDCLOUDHOST_API}/user-resource/vm?uuid=${config.IDCLOUDHOST_UUID}`, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

export const vmStatus = async () => {
    const result = await vmInfo();
    return result?.status === 'running';
};

export const vmOperate = async (status: string) => {
    const result = await axios.post(`${config.IDCLOUDHOST_API}/user-resource/vm/${status}`, { uuid: `${config.IDCLOUDHOST_UUID}` }, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

/**
* Assigned IP
*/
export const vmIp = async () => {
    const result = await axios.get(`${config.IDCLOUDHOST_API}/network/ip_addresses?vm_uuid=${config.IDCLOUDHOST_UUID}`, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

/**
* Minecraft Server
*/
export const mcServerStatus = async () => {
    const ip = await vmIp();

    if (!ip?.length) {
        throw new Error('Unable to get VM ip !');
    }

    const resultIp = ip[0].address;
    const serverResult = await axios.get(`https://api.mcstatus.io/v2/status/java/${resultIp}`, { headers: { 'Accept-Encoding': '*' } });

    return serverResult?.data?.online === true;
};