import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event) => {
    const ip = event.getClientAddress();
    var getIpv4 = /([^:]+)$/;
	const ipv4 = getIpv4.exec(ip)?.[0];

    return {
        userIp: ipv4
    };
};

