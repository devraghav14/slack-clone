import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateWokspaceModal = () => {
    return useAtom(modalState);
}