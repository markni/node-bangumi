import {BGMCollection, BGMSubject, BGMUser} from 'bgm-types';

export = bangumi;

interface BaseParams {
    debug?: boolean;
    app_id?: string;
    access_token?: string;
    protocol?: "http" | "https";
}

interface Callback {
    (error: Error, result?: any): void;
}

declare class bangumi {
    static VERSION: string;

    constructor(options: any);

    auth(params?: BaseParams, callback?: Callback): any;

    createCollection(subject_id: Number, params?: any, callback?: Callback): Promise<BGMCollection.Update>;

    fetchCalendar(callback?: Callback): Promise<BGMSubject.Calendar>;

    fetchCollection(subject_id: Number, params?: any, callback?: Callback): Promise<BGMCollection.Information>;

    fetchEps(subject_id: Number, callback?: Callback): Promise<BGMSubject.Episode>;

    fetchProgress(username: any, params?: any, callback?: Callback): Promise<BGMUser.CollectionProgress>;

    fetchSubject(subject_id: Number, params?: any, callback?: Callback): Promise<BGMSubject.Information>;

    fetchSubjectEps(subject_id: Number, callback?: Callback): Promise<BGMSubject.Episode>;

    fetchUser(username: string, callback?: any): Promise<BGMUser.Information>;

    fetchUserCollection(username: string, params?: any, callback?: Callback): Promise<BGMUser.Collection>;

    fetchUserCollections(username: string, subject_type: any, params?: any, callback?: Callback): Promise<BGMUser.CollectionProgress>;

    fetchUserCollectionsStatus(username: string, params?: any, callback?: Callback): Promise<BGMUser.CollectionStatus>;

    get(url: string, params?: any, callback?: Callback): any;

    post(url: string, params?: any, callback?: Callback): any;

    search(keywords: string, params?: any, callback?: Callback): any;

    setAccessToken(access_token: string): void;

    setPromiseProvider(provider: any): void;

    updateEpStatus(ep_id: Number, status: any, params?: any, callback?: Callback): any;

    updateWatchedEps(subject_id: Number, params?: any, callback?: Callback): any;

}

