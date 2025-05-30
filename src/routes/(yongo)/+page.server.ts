import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event) => {
    const ip = event.getClientAddress();

    console.log('IP del usuario:', ip);

    return {
        userIp: ip
    };
};

