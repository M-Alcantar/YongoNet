export type ContactInfo = {
    username: string;
    chat_url: string;
    date_created: Date;
}

export type MessageObj = {
    sender: string;
    datetime: number;
    message: {
        text: string;
        media: string;
    };
}