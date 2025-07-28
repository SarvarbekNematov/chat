export interface MessageType{
    createAt: string;
    message: string;
    messageId: number;
    newMessage: boolean;
    editMessage?: string;
    role: string;
    link: {
        url: string;
        type:string;
        name: string
    };
}

export interface AllMessageType {
        createAt: string;
    message: string;
    messageId: number;
    newMessage: boolean;
    role: string;
    link: {
        url: string;
        type:string;
        name: string
    };
    editMessage?: string;
    docId: string
}

export interface BackendDataType {
    createAt: string;
    phone: number;
    privateNote: string;
    userId: number;
    userName: string;
    service: string;
    email: string
}

export interface LastMessagesType {
    userId: number ;
    message: string;
    link: {
        url: string;
        type: string;
        name: string;
    };
    createAt: string;
    role: string;
    docId: string;
    newMessage: boolean
}
