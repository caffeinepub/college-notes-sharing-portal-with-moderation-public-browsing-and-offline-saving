import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type NoteId = bigint;
export interface AttachmentMetadata {
    fileSize: bigint;
    fileType: string;
    filename: string;
}
export interface UserProfile {
    name: string;
}
export interface Note {
    title: string;
    verified: boolean;
    subject: string;
    unit: string;
    rejectionReason?: string;
    description: string;
    lastUpdatedTimestamp: bigint;
    createdTimestamp: bigint;
    uploader: Principal;
    attachments: Array<AttachmentMetadata>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMySubmissions(): Promise<Array<Note>>;
    getNoteById(noteId: NoteId): Promise<Note>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedNotes(): Promise<Array<Note>>;
    isCallerAdmin(): Promise<boolean>;
    isModerator(caller: Principal): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitNote(subject: string, unit: string, title: string, description: string, attachments: Array<AttachmentMetadata>): Promise<NoteId>;
    verifyNote(noteId: NoteId, rejectReason: string | null): Promise<void>;
}
