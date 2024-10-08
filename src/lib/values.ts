import './env';

export default class Values {
    static api_key          = process.env.APIKEY;
    static aisha_v1_api     = `${process.env.ENDPOINT}/v1/aisha`;
    static aisha_v2_api     = `${process.env.ENDPOINT}/v2/aisha`;
    static aisha_v3_api     = `${process.env.ENDPOINT}/v3/aisha`;
}
