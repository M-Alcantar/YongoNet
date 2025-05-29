import { EMAIL_USER, EMAIL_PASS } from "$env/static/private";
import { error, fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types.ts';
import nodemailer from 'nodemailer';
import { usernameTaken, createUser } from '$lib/server/db/index.js';
import { performLogin } from '$lib/server/session/index.js';

export const prerender = false;
export const load: PageServerLoad = async (session) => {
    var sessionData = session.cookies.get('sid');
    if (sessionData) {
        return redirect(303, '/');
    }
    return {};
};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

const register: Action = async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');
    const usermail = data.get('usermail');

    if (!username) {
        return fail(400, { nameEmpty: true })
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return error(400, 'Username and Password must be a string');
    }

    if (username.length > 64) {
        return fail(400, { nameLen: true })
    }
    if (password.length < 8 || password.length > 50) {
        return fail(400, { passLen: true })
    }

    if (await usernameTaken(username)) {
        return fail(400, { userExists: true });
    }

    try {
        await createUser(username, password);
        await performLogin(cookies, username);

        if (usermail) {
            const mailOptions = {
                from: EMAIL_USER,
                to: usermail.toString(),
                subject: "Welcome to YongoNet!",
                html: "Congrats <b>" + username + "</b>,<br><br>Usa YongoNet o te yongueamos.",
            };

            transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        return fail(500, { error: 'Internal server error' });
    }

    console.log(`New user registered: ${ username }`)
    return redirect(303, '../');
};

export const actions: Actions = { register };